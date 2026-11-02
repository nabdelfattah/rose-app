import { Component, computed, input, output } from '@angular/core';
import { LucideChevronsLeft, LucideChevronsRight, LucideChevronLeft, LucideChevronRight } from '@lucide/angular';

type PageItem = number | '...';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [ LucideChevronsLeft, LucideChevronsRight, LucideChevronLeft, LucideChevronRight ],
  templateUrl: './paginator.html'
})
export class Paginator {
page = input(1);    
totalPages = input(1);
pageChange = output<number>();

items = computed<PageItem[]>(() => {
  const total = this.totalPages();
  const cur = this.page();
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (cur <= 3) return [1, 2, 3, '...', total];
  if (cur >= total - 2) return [1, '...', total - 2, total - 1, total];
  return [1, '...', cur - 1, cur, cur + 1, '...', total];
});

go(p: number) {
  if (p < 1 || p > this.totalPages() || p === this.page()) return;
  this.pageChange.emit(p);
}

  btn =
    'size-8 flex items-center justify-center rounded-lg border border-zinc-100 bg-zinc-50 text-zinc-800 ' +
    'cursor-pointer transition-colors hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed ' +
    'dark:border-0';

  activeCls =
    '!bg-[#A6252A] !border-[#A6252A] !text-zinc-50 font-semibold ' +
    'dark:!bg-[#FFA3B9] dark:!border-[#FFA3B9]';

}