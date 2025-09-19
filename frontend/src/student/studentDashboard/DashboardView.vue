<!-- src/views/dashboard/DashboardView.vue -->
<template>
  <div class="min-h-screen flex bg-[radial-gradient(ellipse_at_bottom_left,_#071023,_#03060b)] text-white p-4 gap-6">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main -->
    <main class="flex-1 overflow-auto">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left column -->
        <div class="col-span-1 flex flex-col gap-6">
          <ProfileCard />

          <!-- My Courses -->
          <div class="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-transparent border border-white/6">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-white font-semibold">My Courses</div>
                <div class="text-xs text-white/60">Continue learning — quick access</div>
              </div>
              <div class="text-xs text-white/50">4 active</div>
            </div>

            <div class="mt-4 grid gap-3">
              <CourseCard v-for="c in courses.slice(0,3)" :key="c.title" v-bind="c" />
            </div>

            <div class="mt-3 text-center">
              <button class="px-4 py-2 rounded-lg bg-white/6">View all courses</button>
            </div>
          </div>

          <AIPanel />
        </div>

        <!-- Middle column -->
        <div class="col-span-1 flex flex-col gap-6">
          <!-- Today -->
          <div class="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-transparent border border-white/6">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-white font-semibold">Today</div>
                <div class="text-xs text-white/60">Your schedule & quick actions</div>
              </div>
              <div class="text-xs text-white/60">Sep 4, 2025</div>
            </div>

            <div class="mt-4 grid gap-3">
              <div class="p-3 rounded-lg bg-white/4 flex items-center justify-between">
                <div>
                  <div class="text-sm text-white/90">10:00 AM — Live Math Class</div>
                  <div class="text-xs text-white/60">Room: Algebra — Link</div>
                </div>
                <button class="px-3 py-1 rounded-md bg-gradient-to-r from-blue-500 to-teal-400">Join</button>
              </div>

              <div class="p-3 rounded-lg bg-white/4 flex items-center justify-between">
                <div>
                  <div class="text-sm text-white/90">4:00 PM — Assignment: Lab Report</div>
                  <div class="text-xs text-white/60">Due: Sep 6</div>
                </div>
                <button class="px-3 py-1 rounded-md bg-white/6">Open</button>
              </div>
            </div>
          </div>

          <!-- Assignments -->
          <div class="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-transparent border border-white/6">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-white font-semibold">Assignments</div>
                <div class="text-xs text-white/60">Due soon</div>
              </div>
              <div class="text-xs text-white/60">2 due</div>
            </div>

            <div class="mt-4 grid gap-3">
              <div class="p-3 rounded-lg bg-white/4 flex items-center justify-between">
                <div>
                  <div class="text-sm text-white/90">Physics Worksheet</div>
                  <div class="text-xs text-white/60">Due: Sep 6</div>
                </div>
                <button class="px-3 py-1 rounded-md bg-gradient-to-r from-purple-500 to-violet-500">Start</button>
              </div>

              <div class="p-3 rounded-lg bg-white/4 flex items-center justify-between">
                <div>
                  <div class="text-sm text-white/90">Essay: History — 1000 words</div>
                  <div class="text-xs text-white/60">Due: Sep 10</div>
                </div>
                <button class="px-3 py-1 rounded-md bg-white/6">Start</button>
              </div>
            </div>
          </div>

          <MiniCalendar />
        </div>

        <!-- Right column -->
        <div class="col-span-1 flex flex-col gap-6">
          <AnalyticsWidget />

          <!-- Badges -->
          <div class="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-transparent border border-white/6">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-white font-semibold">Badges & Streaks</div>
                <div class="text-xs text-white/60">Earned rewards & motivation</div>
              </div>
              <div class="text-xs text-white/60">Total 8</div>
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
              <div class="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-violet-500/20">🔥 12-day streak</div>
              <div class="px-3 py-2 rounded-lg bg-gradient-to-r from-teal-400/20 to-blue-400/20">🏅 Quiz Master</div>
              <div class="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-400/20 to-violet-300/20">💡 Fast Learner</div>
            </div>

            <div class="mt-4 text-xs text-white/60">Keep your streak by completing 15 more minutes today.</div>
          </div>

          <!-- Shortcuts -->
          <div class="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-transparent border border-white/6">
            <div class="text-white font-semibold">Shortcuts</div>
            <div class="mt-3 grid grid-cols-2 gap-3">
              <button class="p-3 rounded-lg bg-white/4">Flashcards</button>
              <button class="p-3 rounded-lg bg-white/4">Mock Tests</button>
              <button class="p-3 rounded-lg bg-white/4">Notes</button>
              <button class="p-3 rounded-lg bg-white/4">Study Plan</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import ProfileCard from './components/ProfileCard.vue'
import CourseCard from './components/CourseCard.vue'
import AIPanel from './components/AIPanel.vue'
import MiniCalendar from './components/MiniCalendar.vue'
import AnalyticsWidget from './components/AnalyticsWidget.vue'

export default {
  name: 'DashboardView',
  components: {
    Sidebar,
    ProfileCard,
    CourseCard,
    AIPanel,
    MiniCalendar,
    AnalyticsWidget
  },
  data() {
    return {
      courses: [
        { title: 'Algebra II', progress: 0.67, deadline: 'Sep 14', color: 'blue' },
        { title: 'Physics — Mechanics', progress: 0.45, deadline: 'Sep 19', color: 'teal' },
        { title: 'World History', progress: 0.82, deadline: 'Sep 21', color: 'purple' },
        { title: 'Computer Science', progress: 0.25, deadline: 'Sep 10', color: 'blue' },
      ]
    }
  }
}
</script>
