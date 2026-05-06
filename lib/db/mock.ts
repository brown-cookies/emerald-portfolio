// ─── Mock data ────────────────────────────────────────────────────────────────
// Used when DATABASE_URL is not set so you can run `npm run dev` locally
// without a Neon account. Every shape matches the Drizzle inferred types.
// Replace with real data once you run `npm run db:push && npm run db:seed`.

import type { PostWithSeries } from '@/lib/blog'
import type { Series, Comment } from '@/lib/db/schema'

const NOW  = new Date().toISOString()
const WEEK = (n: number) => new Date(Date.now() - n * 7 * 24 * 60 * 60 * 1000).toISOString()

// ─── Series ───────────────────────────────────────────────────────────────────

export const mockSeries: Series[] = [
  {
    id:          1,
    slug:        'building-hanh',
    title:       'Building HanH',
    description: 'A full build log of my AI robot companion — hardware, firmware, and AI pipeline.',
    createdAt:   WEEK(8),
  },
]

// ─── Posts ────────────────────────────────────────────────────────────────────

const POST_1_CONTENT = `
# Why I Switched from Create React App to Next.js 15

After two years of shipping production apps with Create React App, I finally made the jump to Next.js 15 with React 19.

Here's what actually changed for me — not the marketing copy, the real day-to-day differences.

## The file-based router is now obvious

App Router felt weird at first. Folders as routes, \`layout.tsx\` nesting, \`loading.tsx\` skeletons — it reads like framework magic. But after a few weeks it clicks.

The mental model is: **every folder is a route segment, every file is a role**.

\`\`\`
app/
  blog/
    layout.tsx     ← shared chrome for all blog pages
    page.tsx       ← /blog list
    [slug]/
      page.tsx     ← /blog/my-post
      loading.tsx  ← skeleton shown while fetching
      not-found.tsx
\`\`\`

Compare that to CRA where you'd wire all of this up manually with react-router v6, and suddenly App Router doesn't feel magical — it feels like it's just doing the obvious thing.

## React Server Components mean less JS to the browser

This is the one that actually matters for performance. Server Components run on the server, render to HTML, and ship **zero JavaScript** for that component.

My blog post page fetches MDX from the database, compiles it with \`next-mdx-remote/rsc\`, runs \`rehype-pretty-code\` for syntax highlighting — none of that runs in the browser. The visitor gets static HTML with pre-highlighted code.

\`\`\`ts title="app/blog/[slug]/page.tsx"
// This entire component runs server-side only
export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug((await params).slug)
  if (!post) notFound()
  return <MDXContent source={post.content} />
}
\`\`\`

<Callout type="info" title="What ships to the browser">
  Only interactive components tagged \`'use client'\` ship JavaScript. Static pages are pure HTML.
</Callout>

## params and searchParams are now Promises

Next.js 15 made \`params\` and \`searchParams\` async. If you're migrating, you'll hit TypeScript errors on every page that uses them.

\`\`\`ts
// Next.js 14 (old)
export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
}

// Next.js 15 (new)
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
}
\`\`\`

It's a one-line fix per page but you have to catch every one.

## Verdict

Next.js 15 is better for everything except cold-start time on Vercel's free tier. If you're building a content-heavy site or a dashboard, switch. If you're building a highly interactive SPA with no server data needs, CRA (or Vite) is still fine.
`

const POST_2_CONTENT = `
# Setting Up the Raspberry Pi for HanH — Part 1

This is the first post in my HanH build log. HanH is an AI robot companion I'm building on a Raspberry Pi 3B+. In this post: hardware setup, OS config, and the Python environment.

## The hardware

| Component | Part |
|---|---|
| SBC | Raspberry Pi 3B+ |
| Microphone | USB mic |
| Display | ST7789 240×240 LCD (SPI) |
| Motors | 2× DC motors + L298N driver |
| Power | 18650 2S Li-Ion + BMS + Mini360 buck |

The ST7789 LCD is the face — it'll display emotions using PIL-drawn circles and arcs. The L298N drives two DC motors for movement.

## OS setup

I started with Raspberry Pi OS Lite (64-bit, no desktop). Headless setup:

1. Flash with Raspberry Pi Imager
2. Enable SSH and set WiFi credentials in the Imager options before flashing
3. Boot, SSH in, run updates:

\`\`\`bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3-pip python3-venv git -y
\`\`\`

## Python environment

HanH has split requirements for Windows (dev) and Pi (production):

\`\`\`
requirements/
  base.txt      ← shared packages (drizzle, langchain, etc.)
  windows.txt   ← dev extras (mock GPIO, Windows audio)
  pi.txt        ← Pi-specific (RPi.GPIO, ST7789, pvporcupine)
\`\`\`

\`\`\`bash
# On the Pi
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements/base.txt -r requirements/pi.txt
\`\`\`

<Callout type="warning" title="GPIO permissions">
  Add your user to the \`gpio\` and \`spi\` groups or you'll get permission errors when accessing the LCD.
  \`sudo usermod -aG gpio,spi $USER\` then reboot.
</Callout>

## Mock GPIO for Windows dev

The Pi-specific libraries (\`RPi.GPIO\`, \`ST7789\`) don't install on Windows. I wrote a mock layer:

\`\`\`python title="utils/mock_gpio.py"
class MockGPIO:
    BCM = OUT = IN = HIGH = LOW = 0
    def setmode(self, *a): pass
    def setup(self, *a): pass
    def output(self, *a): pass
    def cleanup(self): pass
\`\`\`

Then in settings:

\`\`\`python title="config/settings.py"
import platform

if platform.system() == 'Windows':
    from utils.mock_gpio import MockGPIO as GPIO
else:
    import RPi.GPIO as GPIO
\`\`\`

Same code, runs on both platforms. No conditional imports scattered everywhere.

## What's next

Part 2 covers the EventBus — the pub/sub core that connects VoiceNode → AINode → CommandNode → HardwareNode.
`

const POST_3_CONTENT = `
# How I Structured a Django REST API for Production

Most Django tutorials stop at \`python manage.py startproject\`. Here's how I actually structure a DRF project that I can maintain six months later.

## The app split

One monolithic \`api\` app is a trap. I split by domain:

\`\`\`
myproject/
  apps/
    users/        ← auth, profiles, permissions
    posts/        ← the main resource
    comments/     ← related resource
    notifications/← async side effects
  core/
    settings/
      base.py
      local.py
      production.py
    urls.py
    wsgi.py
\`\`\`

Each app has its own \`models.py\`, \`serializers.py\`, \`views.py\`, \`urls.py\`, and \`tests/\`.

## Split settings

Single \`settings.py\` files grow into unreadable monsters. Split early:

\`\`\`python title="core/settings/base.py"
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent.parent

INSTALLED_APPS = [
    # Django core
    'django.contrib.auth',
    # ...
    # Apps
    'apps.users',
    'apps.posts',
]
\`\`\`

\`\`\`python title="core/settings/local.py"
from .base import *  # noqa

DEBUG = True
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME':   BASE_DIR / 'db.sqlite3',
    }
}
\`\`\`

Then run with \`DJANGO_SETTINGS_MODULE=core.settings.local python manage.py runserver\`.

## Serializer discipline

The biggest DRF mistake I see: one serializer for reads and writes. The fields you expose for a GET are rarely the same as what you accept in a POST.

\`\`\`python
class PostReadSerializer(serializers.ModelSerializer):
    author = UserMinimalSerializer(read_only=True)
    tags   = TagSerializer(many=True, read_only=True)

    class Meta:
        model  = Post
        fields = ['id', 'title', 'content', 'author', 'tags', 'published_at']


class PostWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Post
        fields = ['title', 'content', 'tags']  # author set from request.user
\`\`\`

<Callout type="info">
  Use \`get_serializer_class\` in your ViewSet to switch between them based on the action.
</Callout>

## One thing I wish I knew earlier

Put your business logic in **service functions**, not in serializers or views.

\`\`\`python title="apps/posts/services.py"
def publish_post(post: Post, user: User) -> Post:
    if post.author != user:
        raise PermissionDenied("You don't own this post.")
    post.published_at = timezone.now()
    post.save(update_fields=['published_at'])
    notify_subscribers.delay(post.id)   # Celery task
    return post
\`\`\`

Your view calls \`publish_post(post, request.user)\`. Your test calls the same function directly — no HTTP layer needed.
`

const POST_4_CONTENT = `
# The EventBus — HanH's Nervous System (Part 2)

Every node in HanH communicates through a single EventBus. No direct imports between nodes. No shared state. Just topics and callbacks.

## Why an event-driven architecture

The robot needs to do several things in parallel:
- Listen for wake words
- Stream audio to the AI server
- Drive motors
- Animate the LCD face

If these are tightly coupled, changing one breaks another. With an EventBus, each node only knows about topics — not about each other.

## The EventBus implementation

\`\`\`python title="core/event_bus.py"
from typing import Callable, Any
import threading

class EventBus:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        # Singleton — one bus for the whole application
        if not cls._instance:
            with cls._lock:
                if not cls._instance:
                    cls._instance = super().__new__(cls)
                    cls._instance._subscribers: dict[str, list[Callable]] = {}
        return cls._instance

    def subscribe(self, topic: str, callback: Callable) -> None:
        self._subscribers.setdefault(topic, []).append(callback)

    def publish(self, topic: str, data: Any = None) -> None:
        for cb in self._subscribers.get(topic, []):
            cb(data)

    def unsubscribe(self, topic: str, callback: Callable) -> None:
        if topic in self._subscribers:
            self._subscribers[topic].remove(callback)
\`\`\`

## Topics

Topics are just strings. I centralise them to avoid typos:

\`\`\`python title="topics/topics.py"
VOICE_INPUT      = 'voice/input'
AI_RESPONSE      = 'ai/response'
COMMAND_EXECUTE  = 'command/execute'
HARDWARE_STATUS  = 'hardware/status'
FACE_EMOTION     = 'face/emotion'
FACE_LOOK        = 'face/look'
\`\`\`

## A node in practice

\`\`\`python title="nodes/voice_node.py"
from core.event_bus import EventBus
from topics.topics import VOICE_INPUT
import speech_recognition as sr

class VoiceNode:
    def __init__(self):
        self.bus = EventBus()
        self.recognizer = sr.Recognizer()

    def start(self):
        with sr.Microphone() as source:
            while True:
                audio = self.recognizer.listen(source)
                try:
                    text = self.recognizer.recognize_google(audio)
                    self.bus.publish(VOICE_INPUT, {'text': text})
                except sr.UnknownValueError:
                    pass  # background noise — ignore
\`\`\`

VoiceNode publishes to \`voice/input\`. AINode subscribes to \`voice/input\`, calls the FastAPI server, then publishes to \`ai/response\`. CommandNode subscribes to \`ai/response\` and so on.

<Callout type="success" title="The result">
  Swapping the AI model from Ollama to a different backend means changing one node.
  Everything else stays identical.
</Callout>

## Next

Part 3 covers the FastAPI AI server on the laptop side — the LangGraph graph, ChromaDB memory, and Mistral via Ollama.
`

export const mockPosts: PostWithSeries[] = [
  {
    id:          1,
    slug:        'nextjs-15-vs-create-react-app',
    title:       'Why I Switched from Create React App to Next.js 15',
    description: 'Two years of CRA, then Next.js 15 with React 19. Here are the real day-to-day differences — not the marketing copy.',
    content:     POST_1_CONTENT.trim(),
    tags:        ['nextjs', 'react', 'typescript', 'web'],
    seriesId:    null,
    seriesOrder: null,
    readingTime: '5 min read',
    published:   true,
    createdAt:   WEEK(3),
    updatedAt:   WEEK(3),
    series:      null,
  },
  {
    id:          2,
    slug:        'hanh-part-1-raspberry-pi-setup',
    title:       'Setting Up the Raspberry Pi for HanH — Part 1',
    description: 'Hardware list, OS config, split Python requirements, and a mock GPIO layer so the code runs on Windows and Pi without changes.',
    content:     POST_2_CONTENT.trim(),
    tags:        ['robotics', 'python', 'raspberry-pi', 'ai'],
    seriesId:    1,
    seriesOrder: 1,
    readingTime: '4 min read',
    published:   true,
    createdAt:   WEEK(5),
    updatedAt:   WEEK(5),
    series:      mockSeries[0],
  },
  {
    id:          3,
    slug:        'django-rest-api-production-structure',
    title:       'How I Structured a Django REST API for Production',
    description: 'Domain-split apps, split settings, read vs write serializers, and service functions. Everything I wish I knew at the start.',
    content:     POST_3_CONTENT.trim(),
    tags:        ['django', 'python', 'backend', 'api'],
    seriesId:    null,
    seriesOrder: null,
    readingTime: '6 min read',
    published:   true,
    createdAt:   WEEK(7),
    updatedAt:   WEEK(7),
    series:      null,
  },
  {
    id:          4,
    slug:        'hanh-part-2-eventbus',
    title:       "The EventBus — HanH's Nervous System (Part 2)",
    description: "How a singleton pub/sub EventBus decouples VoiceNode, AINode, CommandNode, and HardwareNode so changing one doesn't break the others.",
    content:     POST_4_CONTENT.trim(),
    tags:        ['robotics', 'python', 'architecture', 'ai'],
    seriesId:    1,
    seriesOrder: 2,
    readingTime: '5 min read',
    published:   true,
    createdAt:   WEEK(2),
    updatedAt:   WEEK(2),
    series:      mockSeries[0],
  },
]

// ─── Comments ─────────────────────────────────────────────────────────────────

export const mockComments: Comment[] = [
  {
    id:        1,
    postId:    1,
    name:      'Ivan Espinosa',
    email:     'ivan@example.com',
    content:   "The async params change caught me off guard too. Good writeup — saved me from digging through the changelog.",
    approved:  true,
    createdAt: WEEK(2),
  },
  {
    id:        2,
    postId:    1,
    name:      'Eaye Marimla',
    email:     'eaye@example.com',
    content:   'The Server Components section finally made it click for me. Zero JS for static content — obvious in hindsight but I needed to see it explained this way.',
    approved:  true,
    createdAt: WEEK(1),
  },
  {
    id:        3,
    postId:    4,
    name:      'Klein Parbo',
    email:     'klein@example.com',
    content:   "That MockGPIO pattern is elegant. I've been conditionally importing all over the place — going to refactor with this approach.",
    approved:  true,
    createdAt: WEEK(1),
  },
]
