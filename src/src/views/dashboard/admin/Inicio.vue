<script setup>
import VisorPDF from '../../../components/VisorPDF.vue';
</script>

<template>
    <div class="w-full">
        <h1 class="text-white font-bold text-4xl m-5">Dashboard Admin</h1>
        <hr class="border-0 h-px bg-slate-800 mt-5" />
        <div class="w-full">
            <VisorPDF :pdf="'/samurai-olvidado-capitulo1.pdf'"/>
        </div>
    </div>
</template>