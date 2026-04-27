import os

file_path = r'C:\Users\divya\.gemini\antigravity\scratch\salesforce-dashboard\src\Dashboard.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

injection = """
               {/* ADVANCED ANALYTICS SECTION */}
               <div className="space-y-8 mt-10">
                 <div className="flex items-center justify-between">
                   <h3 className="text-2xl font-black tracking-tight flex items-center gap-3"><TrendingUp size={24} className="text-indigo-600" /> Advanced Analytics</h3>
                   <div className="flex gap-2">
                      <div className="px-4 py-1.5 bg-indigo-50/50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> AI Prediction Hub Active
                      </div>
                   </div>
                 </div>

                 <QuotaAttainmentGauge />

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <LeadActivityHeatMap />
                   <DealSizeBubbleChart />
                   <MonthlyWaterfallChart />
                   <LeadScoreScatterPlot />
                 </div>
               </div>
"""

new_lines = []
injected = False

# Find the last line of the sfLeads table
found_index = -1
for i, line in enumerate(lines):
    if 'sfLeads.length/5' in line:
        found_index = i

if found_index != -1:
    # Look for the next </>\n
    for j in range(found_index, len(lines)):
        if '</>' in lines[j]:
            lines.insert(j, injection + '\\n')
            injected = True
            break

if injected:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("Injection successful")
else:
    print("Marker not found")
