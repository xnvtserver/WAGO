<template>
  <div class="min-h-screen flex bg-[radial-gradient(ellipse_at_bottom_left,_#061018,_#02060a)] text-white p-4 gap-6">
    <Sidebar />

    <main class="flex-1 overflow-auto">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left column -->
        <div class="col-span-1 flex flex-col gap-6">
          <TeacherProfileCard :teacher="teacher" />

          <!-- Classroom overview -->
          <ClassroomOverview :classes="classes" />

          <!-- Messaging hub compact -->
          <MessagingHubCompact :messages="messages" />
        </div>

        <!-- Middle column -->
        <div class="col-span-1 lg:col-span-1 flex flex-col gap-6">
          <!-- Today's schedule & quick actions -->
          <div class="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-transparent border border-white/6">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-white font-semibold">Today</div>
                <div class="text-xs text-white/60">Your schedule & quick actions</div>
              </div>
              <div class="text-xs text-white/60">{{ todayDate }}</div>
            </div>

            <div class="mt-4 grid gap-3">
              <div v-for="(s, idx) in todaysSchedule" :key="idx" class="p-3 rounded-lg bg-white/4 flex items-center justify-between">
                <div>
                  <div class="text-sm text-white/90">{{ s.time }} — {{ s.title }}</div>
                  <div class="text-xs text-white/60">{{ s.room }}</div>
                </div>
                <div class="flex gap-2">
                  <button class="px-3 py-1 rounded-md bg-gradient-to-r from-emerald-400 to-sapphire-500">Join</button>
                  <button class="px-3 py-1 rounded-md bg-white/6">Notes</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Assignments & Grading Tracker -->
          <AssignmentsTracker :assignments="assignments" />

          <!-- Mini calendar -->
          <MiniCalendar />
        </div>

        <!-- Right column -->
        <div class="col-span-1 flex flex-col gap-6">
          <!-- AI Insights -->
          <AIInsights :insights="aiInsights" />

          <!-- Performance analytics -->
          <PerformanceAnalytics :analytics="analytics" />

          <!-- Full messaging / shortcuts -->
          <MessagingHub :messages="messages" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

/* ---------------------------
   Neon accent classes
   --------------------------- */
const neon = {
  emerald: 'shadow-[0_0_18px_rgba(16,185,129,0.14)] ring-1 ring-emerald-400/30',
  sapphire: 'shadow-[0_0_18px_rgba(59,130,246,0.14)] ring-1 ring-blue-400/30',
  silver: 'shadow-[0_0_14px_rgba(203,213,225,0.06)] ring-1 ring-white/8',
}

/* ---------------------------
   Sample data (replace with API)
   --------------------------- */
const teacher = ref({
  name: 'Dr. Priya Nair',
  subjects: ['Physics', 'Mathematics'],
  load: {
    courses: 4,
    weeklyHours: 12,
  },
  avatarInitials: 'PN',
})

const classes = ref([
  { id: 1, title: 'Physics — Mechanics (Sec A)', students: 28, next: 'Sep 4 • 10:00 AM' },
  { id: 2, title: 'Applied Math — Calculus', students: 32, next: 'Sep 5 • 9:00 AM' },
  { id: 3, title: 'Elective: Astronomy', students: 18, next: 'Sep 6 • 2:00 PM' },
])

const assignments = ref([
  { id: 'a1', title: 'Lab Report: Forces', class: 'Physics — Mechanics', due: 'Sep 6', pending: 12, graded: 16 },
  { id: 'a2', title: 'Problem Set 4', class: 'Applied Math', due: 'Sep 8', pending: 24, graded: 8 },
  { id: 'a3', title: 'Essay: Space Exploration', class: 'Astronomy', due: 'Sep 12', pending: 5, graded: 13 },
])

const messages = ref([
  { id: 'm1', from: 'Parent: Ritu', subject: 'Absence notice', excerpt: 'My child will miss tomorrow...', time: '2h ago' },
  { id: 'm2', from: 'Student: Arjun', subject: 'Grade query', excerpt: 'Could you explain Q3?', time: '6h ago' },
  { id: 'm3', from: 'Parent: Suresh', subject: 'Meeting request', excerpt: 'Can we schedule...', time: '1d ago' },
])

const aiInsights = ref({
  atRisk: [
    { student: 'Arjun S', class: 'Physics', score: 45, attendance: '72%' },
    { student: 'Meera K', class: 'Math', score: 48, attendance: '68%' },
  ],
  suggestions: [
    'Targeted small-group session for Physics — focus on free-body diagrams.',
    'Assign 10-minute formative quizzes before each class this week.',
  ],
  engagement: 'Below average in Applied Math — try live polls & quick problem solves.',
})

const analytics = ref({
  attendanceAvg: 91,
  avgMarks: 78,
  engagementScore: 'Moderate',
  trends: {
    attendance: [92, 91, 93, 90, 91, 89, 91],
    marks: [76, 78, 80, 77, 79, 81, 78],
  },
})

/* simple computed */
const todayDate = computed(() => {
  const d = new Date()
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
})

const todaysSchedule = ref([
  { time: '9:00 AM', title: 'Applied Math — Lecture', room: 'Zoom • Link' },
  { time: '11:00 AM', title: 'Office Hours', room: 'Room 204 • Link' },
])

/* ---------------------------
   Register inline components
   --------------------------- */

/* Sidebar */
const Sidebar = {
  name: 'Sidebar',
  setup() {
    const items = [
      { name: 'Dashboard', icon: 'M3 12h18M3 6h18M3 18h18' },
      { name: 'Courses', icon: 'M4 6h16v12H4z' },
      { name: 'Assignments', icon: 'M6 2h8l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z' },
      { name: 'Exams', icon: 'M12 2l3 6 6 .5-4.5 4 1 6L12 14l-5.5 4 1-6L3 8.5 9 8z' },
      { name: 'Messages', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
      { name: 'Analytics', icon: 'M3 3v18h18' },
      { name: 'Settings', icon: 'M12 8v8' },
    ]
    return () => (
      <aside class="w-20 md:w-56 flex flex-col items-center md:items-start p-3 md:px-4 space-y-6 bg-gradient-to-b from-[#041018] via-[#04121a] to-[#02060a] border-r border-white/5">
        <div class="w-full flex items-center justify-center md:justify-between">
          <div class="text-white font-bold text-lg md:text-xl tracking-wide">Felidae</div>
          <div class="hidden md:block text-xs text-white/60">Faculty Portal</div>
        </div>
        <nav class="w-full flex flex-col gap-2">
          {items.map(it => (
            <button key={it.name} class={`flex items-center gap-3 w-full p-2 md:px-3 rounded-lg hover:scale-[1.01] transition transform ${neon.sapphire}`}>
              <svg class="w-5 h-5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d={it.icon} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="hidden md:inline text-sm text-white/80">{it.name}</span>
            </button>
          ))}
        </nav>
        <div class="mt-auto w-full">
          <button class="w-full py-2 rounded-lg backdrop-blur bg-white/3 text-sm font-medium text-white/90">Help & Docs</button>
        </div>
      </aside>
    )
  },
}

/* Teacher Profile Card */
const TeacherProfileCard = {
  name: 'TeacherProfileCard',
  props: ['teacher'],
  setup(props) {
    return () => (
      <div class="p-4 rounded-2xl bg-gradient-to-br from-white/3 to-transparent border border-white/6 w-full max-w-sm">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-tr from-emerald-500 to-sapphire-500">
            <div class="text-xl font-bold text-white">{props.teacher.avatarInitials}</div>
          </div>
          <div>
            <div class="text-white font-semibold text-lg">{props.teacher.name}</div>
            <div class="text-sm text-white/60">{props.teacher.subjects.join(' • ')}</div>
          </div>
        </div>

        <div class="mt-4">
          <div class="text-xs text-white/60 mb-2">Current Load</div>
          <div class="flex items-center gap-4">
            <div>
              <div class="text-sm text-white/60">Courses</div>
              <div class="text-xl font-bold text-white">{props.teacher.load.courses}</div>
            </div>
            <div>
              <div class="text-sm text-white/60">Weekly Hrs</div>
              <div class="text-xl font-bold text-white">{props.teacher.load.weeklyHours}</div>
            </div>
          </div>

          <div class="mt-3 flex gap-2">
            <button class="px-3 py-1 rounded-lg text-sm bg-gradient-to-r from-emerald-400 to-sapphire-500">Create Assignment</button>
            <button class="px-3 py-1 rounded-lg text-sm bg-white/6">Quick Grade</button>
          </div>
        </div>
      </div>
    )
  },
}

/* Classroom Overview */
const ClassroomOverview = {
  name: 'ClassroomOverview',
  props: ['classes'],
  setup(props) {
    return () => (
      <div class="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-transparent border border-white/6 w-full">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-white font-semibold">Classroom Overview</div>
            <div class="text-xs text-white/60">Courses taught & schedules</div>
          </div>
          <div class="text-xs text-white/60">{props.classes.length} classes</div>
        </div>

        <div class="mt-4 grid gap-3">
          {props.classes.map(c => (
            <div key={c.id} class={`p-3 rounded-lg bg-white/4 flex items-center justify-between ${neon.silver}`}>
              <div>
                <div class="text-sm text-white/90 font-semibold">{c.title}</div>
                <div class="text-xs text-white/60">{c.students} students • Next: {c.next}</div>
              </div>
              <div class="flex flex-col items-end gap-2">
                <button class="px-3 py-1 rounded-md text-sm bg-gradient-to-r from-sapphire-500 to-emerald-400">Open</button>
                <div class="text-xs text-white/60">Roster</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
}

/* Assignments & Grading Tracker */
const AssignmentsTracker = {
  name: 'AssignmentsTracker',
  props: ['assignments'],
  setup(props) {
    const quickGrade = (id) => {
      // placeholder: integrate grading modal or API
      alert(`Open quick grading for ${id}`)
    }

    return () => (
      <div class="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-transparent border border-white/6 w-full">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-white font-semibold">Assignments & Grading</div>
            <div class="text-xs text-white/60">Pending submissions and quick tools</div>
          </div>
          <div class="text-xs text-white/60">{props.assignments.length} items</div>
        </div>

        <div class="mt-4 grid gap-3">
          {props.assignments.map(a => (
            <div key={a.id} class={`p-3 rounded-lg bg-white/4 flex items-center justify-between ${neon.sapphire}`}>
              <div>
                <div class="text-sm text-white/90 font-semibold">{a.title}</div>
                <div class="text-xs text-white/60">{a.class} • Due: {a.due}</div>
                <div class="text-xs text-white/60 mt-2">Pending: <strong>{a.pending}</strong> • Graded: {a.graded}</div>
              </div>

              <div class="flex flex-col items-end gap-2">
                <button onClick={() => quickGrade(a.id)} class="px-3 py-1 rounded-md text-sm bg-gradient-to-r from-emerald-400 to-sapphire-500">Quick Grade</button>
                <button class="px-3 py-1 rounded-md text-sm bg-white/6">Download</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
}

/* AI Insights widget */
const AIInsights = {
  name: 'AIInsights',
  props: ['insights'],
  setup(props) {
    const openStrategy = (t) => alert(t)
    return () => (
      <div class="p-4 rounded-2xl bg-gradient-to-br from-white/3 to-transparent border border-white/6 w-full">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-white font-semibold">AI Insights</div>
            <div class="text-xs text-white/60">Students at risk & recommended strategies</div>
          </div>
          <div class="px-3 py-1 text-xs rounded-lg bg-white/4">Model: Adaptive</div>
        </div>

        <div class="mt-4 grid gap-3">
          <div class="p-3 rounded-lg bg-white/5">
            <div class="text-xs text-white/60">At-risk students</div>
            <div class="mt-2">
              {props.insights.atRisk.map(s => (
                <div class="flex items-center justify-between py-2" key={s.student}>
                  <div>
                    <div class="text-sm text-white/90 font-semibold">{s.student}</div>
                    <div class="text-xs text-white/60">{s.class} • Score: {s.score}% • Attendance: {s.attendance}</div>
                  </div>
                  <button class="px-2 py-1 rounded-md text-sm bg-gradient-to-r from-emerald-400 to-sapphire-500">Coach</button>
                </div>
              ))}
            </div>
          </div>

          <div class="p-3 rounded-lg bg-white/5">
            <div class="text-xs text-white/60">Suggested strategies</div>
            <ul class="mt-2 list-inside list-disc text-xs text-white/70">
              {props.insights.suggestions.map((s, i) => (
                <li key={i} class="py-1 flex items-center justify-between">
                  <span>{s}</span>
                  <button onClick={() => openStrategy(s)} class="ml-2 text-xs px-2 py-1 rounded bg-white/6">Use</button>
                </li>
              ))}
            </ul>
          </div>

          <div class="p-3 rounded-lg bg-white/5">
            <div class="text-xs text-white/60">Engagement</div>
            <div class="text-lg font-bold text-white mt-1">{props.insights.engagement}</div>
            <div class="text-xs text-white/60 mt-1">Realtime suggestions: Use live polls & group breakout to boost attention.</div>
          </div>
        </div>
      </div>
    )
  },
}

/* Performance analytics (chart placeholders) */
const PerformanceAnalytics = {
  name: 'PerformanceAnalytics',
  props: ['analytics'],
  setup(props) {
    return () => (
      <div class="p-4 rounded-2xl bg-gradient-to-br from-white/3 to-transparent border border-white/6 w-full">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-white font-semibold">Performance Analytics</div>
            <div class="text-xs text-white/60">Class performance • attendance • engagement</div>
          </div>
          <div class="text-xs text-white/60">Last 30 days</div>
        </div>

        <div class="mt-4 grid gap-3">
          <div class="grid grid-cols-3 gap-3 text-center">
            <div class="p-3 rounded-lg bg-white/4">
              <div class="text-sm text-white/60">Attendance</div>
              <div class="text-2xl font-bold text-white mt-1">{props.analytics.attendanceAvg}%</div>
            </div>
            <div class="p-3 rounded-lg bg-white/4">
              <div class="text-sm text-white/60">Avg Marks</div>
              <div class="text-2xl font-bold text-white mt-1">{props.analytics.avgMarks}%</div>
            </div>
            <div class="p-3 rounded-lg bg-white/4">
              <div class="text-sm text-white/60">Engagement</div>
              <div class="text-2xl font-bold text-white mt-1">{props.analytics.engagementScore}</div>
            </div>
          </div>

          {/* <!-- Chart stubs: replace with real charts --> */}
          <div class="p-3 rounded-lg bg-white/5">
            <div class="text-xs text-white/60">Attendance Trend</div>
            <div class="mt-2 h-20 flex items-end gap-2">
              {props.analytics.trends.attendance.map((v, i) => (
                <div key={i} class="flex-1">
                  <div class="mx-auto h-full max-h-20 rounded-md" style={{height: `${Math.max(10, (v / 100) * 100)}%`, background: 'linear-gradient(180deg, rgba(59,130,246,0.7), rgba(16,185,129,0.6))'}}></div>
                </div>
              ))}
            </div>
          </div>

          <div class="p-3 rounded-lg bg-white/5">
            <div class="text-xs text-white/60">Marks Trend</div>
            <div class="mt-2 h-20 flex items-end gap-2">
              {props.analytics.trends.marks.map((v, i) => (
                <div key={i} class="flex-1">
                  <div class="mx-auto h-full max-h-20 rounded-md" style={{height: `${Math.max(10, (v / 100) * 100)}%`, background: 'linear-gradient(180deg, rgba(139,92,246,0.7), rgba(99,102,241,0.6))'}}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  },
}

/* Messaging Hub (compact & full) */
const MessagingHubCompact = {
  name: 'MessagingHubCompact',
  props: ['messages'],
  setup(props) {
    return () => (
      <div class="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-transparent border border-white/6 w-full">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-white font-semibold">Messages</div>
            <div class="text-xs text-white/60">Recent communication</div>
          </div>
          <div class="text-xs text-white/60">{props.messages.length}</div>
        </div>

        <div class="mt-3 grid gap-2">
          {props.messages.slice(0,3).map(m => (
            <div key={m.id} class="p-2 rounded-lg bg-white/4 flex items-center justify-between">
              <div>
                <div class="text-sm text-white/90 font-semibold">{m.from}</div>
                <div class="text-xs text-white/60">{m.subject} • {m.excerpt}</div>
              </div>
              <div class="text-xs text-white/60">{m.time}</div>
            </div>
          ))}
        </div>
      </div>
    )
  },
}

const MessagingHub = {
  name: 'MessagingHub',
  props: ['messages'],
  setup(props) {
    const openMessage = (id) => alert(`Open message ${id}`)
    return () => (
      <div class="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-transparent border border-white/6 w-full">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-white font-semibold">Messaging Hub</div>
            <div class="text-xs text-white/60">Chat with students & parents</div>
          </div>
          <div class="text-xs text-white/60">Inbox</div>
        </div>

        <div class="mt-4 grid gap-2">
          {props.messages.map(m => (
            <div key={m.id} class="p-3 rounded-lg bg-white/4 flex items-center justify-between hover:scale-[1.01] transition">
              <div>
                <div class="text-sm text-white/90 font-semibold">{m.from}</div>
                <div class="text-xs text-white/60">{m.subject} • {m.excerpt}</div>
              </div>
              <div class="flex flex-col items-end gap-2">
                <div class="text-xs text-white/60">{m.time}</div>
                <div class="flex gap-2">
                  <button onClick={() => openMessage(m.id)} class="px-2 py-1 rounded-md bg-gradient-to-r from-emerald-400 to-sapphire-500 text-sm">Open</button>
                  <button class="px-2 py-1 rounded-md bg-white/6 text-sm">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
}

/* Mini Calendar (same style) */
const MiniCalendar = {
  name: 'MiniCalendar',
  setup() {
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
    return () => (
      <div class="p-4 rounded-2xl bg-gradient-to-br from-white/3 to-transparent border border-white/6 w-full max-w-md">
        <div class="flex items-center justify-between">
          <div class="text-white font-semibold">Calendar</div>
          <div class="text-xs text-white/60">Sep 2025</div>
        </div>

        <div class="mt-3 grid grid-cols-7 gap-2 text-xs text-white/50">
          {days.map(d => (<div key={d} class="text-center">{d}</div>))}
          {Array.from({length: 28}).map((_,i) => {
            const day = i+1
            const hasEvent = [3,6,10,14,19,21].includes(day)
            return (
              <div key={i} class={`h-10 rounded-lg flex items-center justify-center ${hasEvent ? 'bg-gradient-to-r from-emerald-500/30 to-sapphire-500/20 text-white':'text-white/40'}`}>
                <div class="w-8 h-8 rounded-full flex items-center justify-center">{day}</div>
              </div>
            )
          })}
        </div>

        <div class="mt-3 text-xs text-white/60">
          Upcoming: <strong class="text-white">Faculty Meeting • Sep 10</strong>
        </div>
      </div>
    )
  },
}


const components = {
  Sidebar,
  TeacherProfileCard,
  ClassroomOverview,
  AssignmentsTracker,
  AIInsights,
  PerformanceAnalytics,
  MessagingHubCompact,
  MessagingHub,
  MiniCalendar,
}

Object.entries(components).forEach(([k, v]) => {
  // register for template use
  defineExpose && defineExpose() // noop to satisfy bundlers (no-op)
})
</script>

<style>
/* optional: add small preferences or leave to Tailwind */
</style>
