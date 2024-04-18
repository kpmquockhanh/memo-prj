<script setup lang="ts">
import dayjs from 'dayjs'
import { onBeforeUnmount, onMounted, type Ref, ref } from 'vue'
const start = dayjs('2022-05-13', 'YYYY-MM-DD');


const years:Ref<number> = ref(0);
const months:Ref<number> = ref(0);
const days:Ref<number> = ref(0);

const hours:Ref<number> = ref(0);
const minutes:Ref<number> = ref(0);
const seconds:Ref<number> = ref(0);


let loop: NodeJS.Timeout;

onMounted(() => {
  loop = setInterval(() => {
    const currentDate = dayjs(); // Get the current date
    const diff = dayjs.duration(currentDate.diff(start));
    years.value = diff.years();
    months.value = diff.months();
    days.value = diff.days();
    minutes.value = diff.seconds();
    hours.value = diff.hours();
    minutes.value = diff.minutes();
    seconds.value = diff.seconds();
  })
});

onBeforeUnmount(() => {
  clearInterval(loop)
});
</script>

<template>
  <div class="flex flex-col md:grid md:grid-flow-col gap-5 text-center auto-cols-max">
    <div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
    <span class="countdown font-mono text-5xl">
      <span :style="{
        '--value': years,
      }"></span>
    </span>
      years
    </div>
    <div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
    <span class="countdown font-mono text-5xl">
      <span :style="{
        '--value': months,
      }"></span>
    </span>
      months
    </div>
    <div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
    <span class="countdown font-mono text-5xl">
      <span :style="{
        '--value': days,
      }"></span>
    </span>
      days
    </div>

    <div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
    <span class="countdown font-mono text-5xl">
      <span :style="{
        '--value': hours,
      }"></span>
    </span>
      hours
    </div>

    <div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
    <span class="countdown font-mono text-5xl">
      <span :style="{
        '--value': minutes,
      }"></span>
    </span>
      minutes
    </div>

    <div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
    <span class="countdown font-mono text-5xl">
      <span :style="{
        '--value': seconds,
      }"></span>
    </span>
      seconds
    </div>

  </div>
</template>

<style scoped>

</style>
