<script lang="ts">
  import MarginalNote from '$lib/components/primitives/MarginalNote.svelte';
</script>

<h1 class="h-pull mb-12">MarginalNote</h1>

<article class="relative max-w-prose mx-auto">
  <p class="text-lede leading-relaxed mb-6">
    禪繞畫中，每一筆都是一個決定。沒有橡皮擦，因為人生中從來沒有橡皮擦。
    一道走偏的線，是新圖樣的種子；一個意外的點，是下一筆的起點。
  </p>
  <MarginalNote side="right">這是雜誌風格的<br/>側邊註記，<br/>—— 語喬</MarginalNote>

  <p class="text-lede leading-relaxed mb-6 mt-12">
    Zentangle is yoga with a pen. Eight steps, beginning and ending with breath.
  </p>
  <MarginalNote side="left" rotate={1}>left side note,<br/>跟段落呼應</MarginalNote>
</article>
