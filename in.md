## Codigo Inventory

```html
<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Inventory and Stock Control | PharmaSystem</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#006c75",
                        "background-light": "#f8fafc",
                        "background-dark": "#0f172a",
                        "surface-dark": "#1e293b",
                        "accent-red": "#ef4444",
                        "accent-yellow": "#f59e0b",
                        "accent-green": "#10b981",
                    },
                    fontFamily: {
                        "display": ["Inter", "sans-serif"]
                    },
                    borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
        }
        .tabular-nums { font-variant-numeric: tabular-nums; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
    </style>
</head>
<body class="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased overflow-hidden">
<div class="flex h-screen w-full">
<!-- SideNavBar -->
<aside class="w-64 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark shrink-0">
<div class="p-6 flex items-center gap-3">
<div class="size-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
<span class="material-symbols-outlined text-2xl">medical_services</span>
</div>
<div>
<h1 class="text-sm font-bold tracking-tight">PharmaSystem</h1>
<p class="text-[10px] text-slate-500 font-medium uppercase tracking-widest leading-none">V 1.0.4 PRO</p>
</div>
</div>
<nav class="flex-1 px-4 space-y-1">
<a class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
<span class="material-symbols-outlined">dashboard</span>
                    Dashboard
                </a>
<a class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg bg-primary/10 text-primary border border-primary/20" href="#">
<span class="material-symbols-outlined">inventory_2</span>
                    Inventory
                </a>
<a class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
<span class="material-symbols-outlined">point_of_sale</span>
                    Sales
                </a>
<a class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
<span class="material-symbols-outlined">description</span>
                    Reports
                </a>
<div class="pt-4 pb-2 px-3">
<span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin</span>
</div>
<a class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
<span class="material-symbols-outlined">group</span>
                    Team
                </a>
<a class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
<span class="material-symbols-outlined">settings</span>
                    Configuration
                </a>
</nav>
<div class="p-4 mt-auto">
<div class="p-4 rounded-xl bg-slate-100 dark:bg-surface-dark border border-slate-200 dark:border-slate-800">
<div class="flex items-center gap-3 mb-3">
<div class="size-8 rounded-full bg-slate-300 dark:bg-slate-700" data-alt="Avatar for Dr. Sarah Connor" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBtXG-dbo6r6-0SDGC-C_nx3VIONd96Zzm7Bdl5tw4jDwXoFiPGG_M7c_bxvmrP-Ku40AH8IgCtQNRe1tibHUALymOCaiQeAngUPhwR3_KJWluFQfj97D6oTC3-R8VaW7HWiYFbtvfZX6OL0x3vYbIW1S07KjwuxC59ppcezkZEjOaRpfWJz9Dea_38ZAIrP2FZTAKo6Ip-PG9QfX3fZKSx1ewd2oAiTfI3wJH4aXFVG_C6TDeEqB6WEuHR2zYJ_MnqQrPbZoqBJ1M'); background-size: cover;"></div>
<div class="overflow-hidden">
<p class="text-xs font-semibold truncate">Dr. Sarah Connor</p>
<p class="text-[10px] text-slate-500">Chief Pharmacist</p>
</div>
</div>
<button class="w-full py-1.5 text-[11px] font-bold text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors">
                        SIGN OUT
                    </button>
</div>
</div>
</aside>
<!-- Main Content -->
<main class="flex-1 flex flex-col min-w-0 overflow-hidden">
<!-- TopNavBar -->
<header class="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 flex items-center justify-between z-10 shrink-0">
<div class="flex items-center gap-6 flex-1">
<h2 class="text-lg font-bold tracking-tight shrink-0">Inventory Control</h2>
<div class="relative max-w-md w-full">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
<input class="w-full bg-slate-100 dark:bg-surface-dark border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/40 transition-shadow placeholder:text-slate-500" placeholder="Search SKU, Batch or Product Name..." type="text"/>
</div>
</div>
<div class="flex items-center gap-3">
<button class="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
<span class="material-symbols-outlined text-lg">add_shopping_cart</span>
<span>Generate Order</span>
</button>
<div class="h-8 w-px bg-slate-200 dark:border-slate-800 mx-1"></div>
<button class="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-surface-dark relative">
<span class="material-symbols-outlined">notifications</span>
<span class="absolute top-2 right-2 size-2 bg-accent-red rounded-full border-2 border-white dark:border-background-dark"></span>
</button>
</div>
</header>
<!-- Scrollable Workspace -->
<div class="flex-1 overflow-y-auto p-6 space-y-6">
<!-- Stats Grid -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
<div class="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm group">
<div class="flex justify-between items-start mb-2">
<p class="text-xs font-bold text-slate-500 uppercase tracking-widest">Total SKUs</p>
<span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">category</span>
</div>
<div class="flex items-baseline gap-2">
<p class="text-2xl font-bold tabular-nums">1,248</p>
<p class="text-xs font-semibold text-accent-green">+5%</p>
</div>
</div>
<div class="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm group ring-1 ring-accent-red/20">
<div class="flex justify-between items-start mb-2">
<p class="text-xs font-bold text-slate-500 uppercase tracking-widest">Low Stock Items</p>
<span class="material-symbols-outlined text-accent-red">warning</span>
</div>
<div class="flex items-baseline gap-2">
<p class="text-2xl font-bold tabular-nums">14</p>
<p class="text-xs font-semibold text-accent-red">-2%</p>
</div>
</div>
<div class="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm group ring-1 ring-accent-yellow/20">
<div class="flex justify-between items-start mb-2">
<p class="text-xs font-bold text-slate-500 uppercase tracking-widest">Expiring Soon</p>
<span class="material-symbols-outlined text-accent-yellow">event_busy</span>
</div>
<div class="flex items-baseline gap-2">
<p class="text-2xl font-bold tabular-nums">8</p>
<p class="text-xs font-semibold text-slate-500">-1%</p>
</div>
</div>
</div>
<!-- Filters -->
<div class="flex items-center justify-between gap-4">
<div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
<button class="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full transition-all">All Products</button>
<button class="px-4 py-1.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-full hover:border-primary/50 transition-all">Antibiotics</button>
<button class="px-4 py-1.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-full hover:border-primary/50 transition-all">OTC</button>
<button class="px-4 py-1.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-full hover:border-primary/50 transition-all">Personal Care</button>
<button class="px-4 py-1.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-full hover:border-primary/50 transition-all">Supplements</button>
</div>
<button class="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white px-3 py-1.5">
<span class="material-symbols-outlined text-sm">filter_list</span>
                        Advanced Filters
                    </button>
</div>
<!-- Table Content -->
<div class="flex gap-6 items-start">
<!-- Data Table -->
<div class="flex-1 min-w-0 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
<th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Product Name</th>
<th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">SKU / ID</th>
<th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Stock Level</th>
<th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Expiry</th>
<th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
</tr>
</thead>
<tbody class="divide-y divide-slate-100 dark:divide-slate-800">
<!-- Row 1: Healthy -->
<tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
<td class="px-6 py-4">
<div class="flex flex-col">
<span class="text-sm font-semibold">Amoxicillin 500mg</span>
<span class="text-[10px] font-medium text-slate-500 uppercase">Antibiotics • Capsule</span>
</div>
</td>
<td class="px-6 py-4">
<code class="text-xs font-mono text-primary bg-primary/5 px-2 py-0.5 rounded">SKU-8821</code>
</td>
<td class="px-6 py-4">
<div class="flex items-center gap-3">
<div class="w-24 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
<div class="h-full bg-accent-green" style="width: 75%"></div>
</div>
<span class="text-sm font-bold tabular-nums">140</span>
</div>
</td>
<td class="px-6 py-4">
<span class="text-xs font-medium text-slate-500">Dec 15, 2024</span>
</td>
<td class="px-6 py-4 text-right">
<button class="p-1 text-slate-400 hover:text-primary transition-colors">
<span class="material-symbols-outlined">edit_note</span>
</button>
</td>
</tr>
<!-- Row 2: Warning (Yellow) -->
<tr class="bg-accent-yellow/[0.03] hover:bg-accent-yellow/[0.05] transition-colors border-l-2 border-l-accent-yellow">
<td class="px-6 py-4">
<div class="flex flex-col">
<span class="text-sm font-semibold">Ibuprofen 200mg</span>
<span class="text-[10px] font-medium text-slate-500 uppercase">OTC • Tablet</span>
</div>
</td>
<td class="px-6 py-4">
<code class="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">SKU-1044</code>
</td>
<td class="px-6 py-4">
<div class="flex items-center gap-3">
<div class="w-24 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
<div class="h-full bg-accent-yellow" style="width: 20%"></div>
</div>
<span class="text-sm font-bold text-accent-yellow tabular-nums">15</span>
</div>
</td>
<td class="px-6 py-4">
<span class="text-xs font-bold text-accent-yellow flex items-center gap-1">
                                            Nov 20, 2023
                                        </span>
</td>
<td class="px-6 py-4 text-right">
<button class="p-1 text-primary hover:scale-110 transition-transform">
<span class="material-symbols-outlined">edit_note</span>
</button>
</td>
</tr>
<!-- Row 3: Critical (Red) -->
<tr class="bg-accent-red/[0.03] hover:bg-accent-red/[0.05] transition-colors border-l-2 border-l-accent-red">
<td class="px-6 py-4">
<div class="flex flex-col">
<span class="text-sm font-semibold">Cetirizine 10mg</span>
<span class="text-[10px] font-medium text-slate-500 uppercase">OTC • Liquid</span>
</div>
</td>
<td class="px-6 py-4">
<code class="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">SKU-5529</code>
</td>
<td class="px-6 py-4">
<div class="flex items-center gap-3">
<div class="w-24 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
<div class="h-full bg-accent-red" style="width: 5%"></div>
</div>
<span class="text-sm font-bold text-accent-red tabular-nums">0</span>
</div>
</td>
<td class="px-6 py-4">
<span class="text-xs font-bold text-accent-red">Oct 01, 2023</span>
</td>
<td class="px-6 py-4 text-right">
<button class="p-1 text-primary hover:scale-110 transition-transform">
<span class="material-symbols-outlined">edit_note</span>
</button>
</td>
</tr>
<!-- Row 4: Healthy -->
<tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
<td class="px-6 py-4">
<div class="flex flex-col">
<span class="text-sm font-semibold">Vitamin C 1000mg</span>
<span class="text-[10px] font-medium text-slate-500 uppercase">Supplements • Effervescent</span>
</div>
</td>
<td class="px-6 py-4">
<code class="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">SKU-3321</code>
</td>
<td class="px-6 py-4">
<div class="flex items-center gap-3">
<div class="w-24 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
<div class="h-full bg-accent-green" style="width: 90%"></div>
</div>
<span class="text-sm font-bold tabular-nums">85</span>
</div>
</td>
<td class="px-6 py-4">
<span class="text-xs font-medium text-slate-500">May 10, 2025</span>
</td>
<td class="px-6 py-4 text-right">
<button class="p-1 text-slate-400 hover:text-primary transition-colors">
<span class="material-symbols-outlined">edit_note</span>
</button>
</td>
</tr>
<!-- Row 5: Healthy -->
<tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
<td class="px-6 py-4">
<div class="flex flex-col">
<span class="text-sm font-semibold">Paracetamol 500mg</span>
<span class="text-[10px] font-medium text-slate-500 uppercase">OTC • Tablet</span>
</div>
</td>
<td class="px-6 py-4">
<code class="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">SKU-1102</code>
</td>
<td class="px-6 py-4">
<div class="flex items-center gap-3">
<div class="w-24 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
<div class="h-full bg-accent-green" style="width: 60%"></div>
</div>
<span class="text-sm font-bold tabular-nums">205</span>
</div>
</td>
<td class="px-6 py-4">
<span class="text-xs font-medium text-slate-500">Jul 12, 2025</span>
</td>
<td class="px-6 py-4 text-right">
<button class="p-1 text-slate-400 hover:text-primary transition-colors">
<span class="material-symbols-outlined">edit_note</span>
</button>
</td>
</tr>
</tbody>
</table>
<div class="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
<span class="text-xs font-medium text-slate-500">Showing 5 of 1,248 products</span>
<div class="flex gap-2">
<button class="p-1 rounded bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 transition-colors">
<span class="material-symbols-outlined text-sm">chevron_left</span>
</button>
<button class="p-1 rounded bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 transition-colors">
<span class="material-symbols-outlined text-sm">chevron_right</span>
</button>
</div>
</div>
</div>
<!-- Side Panel: Quick Edit -->
<aside class="w-80 shrink-0 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden self-start sticky top-0">
<div class="p-4 border-b border-slate-100 dark:border-slate-800 bg-primary/5">
<h3 class="text-sm font-bold flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-lg">edit</span>
                                Quick Stock Edit
                            </h3>
</div>
<div class="p-5 space-y-5">
<div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
<p class="text-[10px] font-bold text-slate-500 uppercase mb-1">Active Selection</p>
<p class="text-sm font-semibold">Ibuprofen 200mg</p>
<p class="text-[11px] text-primary font-mono">SKU-1044</p>
</div>
<div class="space-y-3">
<label class="block">
<span class="text-[11px] font-bold text-slate-500 uppercase">Adjust Quantity</span>
<div class="mt-1 flex items-center gap-2">
<button class="size-8 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800">-</button>
<input class="flex-1 min-w-0 bg-white dark:bg-background-dark border-slate-200 dark:border-slate-700 rounded text-center font-bold text-sm" type="number" value="15"/>
<button class="size-8 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800">+</button>
</div>
</label>
<label class="block">
<span class="text-[11px] font-bold text-slate-500 uppercase">Adjustment Reason</span>
<select class="mt-1 w-full bg-white dark:bg-background-dark border-slate-200 dark:border-slate-700 rounded text-xs py-2 focus:ring-primary focus:border-primary">
<option>Received Shipment</option>
<option>Manual Correction</option>
<option>Damaged Goods</option>
<option>Expired (Return to Prov)</option>
</select>
</label>
<label class="block">
<span class="text-[11px] font-bold text-slate-500 uppercase">Batch Number</span>
<input class="mt-1 w-full bg-white dark:bg-background-dark border-slate-200 dark:border-slate-700 rounded text-xs font-mono py-2" type="text" value="B-2023-X99"/>
</label>
</div>
<button class="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-sm">check_circle</span>
                                Save Changes
                            </button>
<button class="w-full py-2.5 bg-transparent text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700">
                                Cancel
                            </button>
</div>
<div class="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
<p class="text-[10px] text-slate-500 leading-relaxed italic">
                                * Last edited by Dr. Connor at 09:45 AM
                            </p>
</div>
</aside>
</div>
</div>
</main>
</div>
</body></html>
```
