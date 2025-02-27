import e,{useState as t,useEffect as a}from"react";import{LineChart as n,CartesianGrid as o,XAxis as r,YAxis as l,Tooltip as s,Line as m,BarChart as c,Bar as i,Treemap as p}from"recharts";class d{constructor(){this.componentCache=new Map,this.renderCount=new Map,this.memoizedAnalysis=null,this.lastAnalysisTimestamp=0,this.lastUpdateTimestamp=0,this.batchedUpdates=new Map,this.CACHE_THRESHOLD=1e3,this.BATCH_THRESHOLD=16}trackPropUsage(e,t,a){this.lastUpdateTimestamp=Date.now(),this.batchedUpdates.has(a)||this.batchedUpdates.set(a,new Set),Object.keys(t).forEach((e=>this.batchedUpdates.get(a).add(e))),this.shouldProcessBatch()&&this.processBatchedUpdates();let n=this.componentCache.get(a);n||(n={componentName:a,props:[]},this.componentCache.set(a,n)),this.renderCount.set(a,(this.renderCount.get(a)||0)+1),Object.entries(t).forEach((([t,a])=>{const o=n.props.find((e=>e.name===t));o?(o.usageCount++,this.areValuesEqual(a,o.lastValue)||(o.valueChanges=(o.valueChanges||0)+1,o.lastValue=this.cloneValue(a))):n.props.push({name:t,type:this.getPropType(a),required:this.isRequired(e,t),usageCount:1,defaultValue:this.getDefaultValue(e,t),valueChanges:0,lastValue:this.cloneValue(a)})})),this.memoizedAnalysis=null}shouldProcessBatch(){return Date.now()-this.lastUpdateTimestamp>=this.BATCH_THRESHOLD}processBatchedUpdates(){this.batchedUpdates.clear()}areValuesEqual(e,t){if(e===t)return!0;if(typeof e!=typeof t)return!1;if("object"!=typeof e)return!1;if(null===e||null===t)return!1;if(Array.isArray(e)&&Array.isArray(t))return e.length===t.length&&e.every(((e,a)=>this.areValuesEqual(e,t[a])));const a=Object.keys(e),n=Object.keys(t);return a.length===n.length&&a.every((a=>this.areValuesEqual(e[a],t[a])))}cloneValue(e){return null==e||"object"!=typeof e?e:Array.isArray(e)?e.map((e=>this.cloneValue(e))):Object.fromEntries(Object.entries(e).map((([e,t])=>[e,this.cloneValue(t)])))}getPropType(e){return void 0===e?"undefined":null===e?"object":typeof e}isRequired(e,t){var a;return!!(null===(a=e.propTypes)||void 0===a?void 0:a[t])}getDefaultValue(e,t){var a;return null===(a=e.defaultProps)||void 0===a?void 0:a[t]}analyzeProps(){const e=Date.now();if(this.memoizedAnalysis&&e-this.lastAnalysisTimestamp<this.CACHE_THRESHOLD&&e-this.lastUpdateTimestamp>this.BATCH_THRESHOLD)return this.memoizedAnalysis;const t=Array.from(this.componentCache.values()),a=[],n=new Map,o=[];return t.forEach((e=>{const t=this.renderCount.get(e.componentName)||0;e.props.forEach((r=>{0===r.usageCount&&a.push({componentName:e.componentName,propName:r.name});const l=`${r.type}:${r.required?"required":"optional"}`,s=n.get(l)||{count:0,components:new Set};s.count++,s.components.add(e.componentName),n.set(l,s),r.valueChanges&&r.valueChanges>.5*t&&o.push({componentName:e.componentName,propName:r.name,updateCount:r.valueChanges})}))})),this.memoizedAnalysis={components:t,unusedProps:a,propPatterns:Array.from(n.entries()).map((([e,t])=>({pattern:e,count:t.count,components:Array.from(t.components)}))),frequentUpdates:o.sort(((e,t)=>t.updateCount-e.updateCount))},this.lastAnalysisTimestamp=e,this.memoizedAnalysis}getComponentPropUsage(e){return this.componentCache.get(e)}getRenderCount(e){return this.renderCount.get(e)||0}reset(){this.componentCache.clear(),this.renderCount.clear(),this.memoizedAnalysis=null,this.lastAnalysisTimestamp=0,this.lastUpdateTimestamp=0,this.batchedUpdates.clear()}}class u{constructor(){this.analyzer=new d,this.listeners=new Set,this.updateInterval=1e3}static getInstance(){return u.instance||(u.instance=new u),u.instance}startMonitoring(e){e&&(this.updateInterval=e),this.intervalId&&this.stopMonitoring(),this.intervalId=window.setInterval((()=>{try{const e=this.analyzer.analyzeProps();this.notifyListeners({type:"update",timestamp:Date.now(),data:e}),this.checkForWarnings(e)}catch(e){this.notifyListeners({type:"error",timestamp:Date.now(),data:e})}}),this.updateInterval)}stopMonitoring(){this.intervalId&&(window.clearInterval(this.intervalId),this.intervalId=void 0)}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}getAnalyzer(){return this.analyzer}notifyListeners(e){this.listeners.forEach((t=>{try{t(e)}catch(e){console.error("Error in monitoring listener:",e)}}))}checkForWarnings(e){const t=e.frequentUpdates.filter((e=>e.updateCount>100));t.length>0&&this.notifyListeners({type:"warning",timestamp:Date.now(),data:{message:"High frequency prop updates detected",components:t}}),e.unusedProps.length>0&&this.notifyListeners({type:"warning",timestamp:Date.now(),data:{message:"Unused props detected",components:e.unusedProps}});const a=e.components.filter((e=>e.props.length>10));a.length>0&&this.notifyListeners({type:"warning",timestamp:Date.now(),data:{message:"Components with many props detected",components:a.map((e=>({name:e.componentName,propCount:e.props.length})))}})}}var h={container:"base-module_container__N-VTj","node-component":"base-module_node-component__3R2-B","node-prop":"base-module_node-prop__6bpoO","link-dependency":"base-module_link-dependency__t58B6","link-update":"base-module_link-update__fj1Pw",chartContainer:"base-module_chartContainer__lcs0d",tooltip:"base-module_tooltip__c9I89",performanceHigh:"base-module_performanceHigh__Hnxwi",performanceMedium:"base-module_performanceMedium__jYlB7",performanceLow:"base-module_performanceLow__RWfP-",section:"base-module_section__l0hua","section-title":"base-module_section-title__GYBoP","section-content":"base-module_section-content__s8HOk",button:"base-module_button__yooH5",buttonActive:"base-module_buttonActive__yBKXk",dataGrid:"base-module_dataGrid__cMCBW",dataItem:"base-module_dataItem__S-ukG",dataLabel:"base-module_dataLabel__-otSE",dataValue:"base-module_dataValue__wYuSW"};const E=({data:c})=>{const[i,p]=t([]),[d,E]=t([]);a((()=>{const e=u.getInstance().subscribe((e=>{if("update"===e.type){const t=e.data,a=g(t);p((e=>[...e,a].slice(-60)))}else"warning"===e.type&&E((t=>[...t,e.data.message]))}));return()=>e()}),[]);const g=e=>{const t=e.components.length,a=e.components.reduce(((e,t)=>e+t.props.filter((e=>e.usageCount>0)).length),0),n=e.components.reduce(((e,t)=>e+t.props.filter((e=>(e.valueChanges||0)/(e.usageCount||1)>.5)).length),0);return{timestamp:Date.now(),activeComponents:t,activeProps:a,highUpdateProps:n}};return e.createElement("div",{className:h.container,"data-testid":"monitoring-dashboard"},e.createElement("h2",null,"Real-time Monitoring"),e.createElement("div",{className:h["chart-container"]},e.createElement(n,{width:800,height:400,data:i},e.createElement(o,{strokeDasharray:"3 3"}),e.createElement(r,{dataKey:"timestamp",tickFormatter:e=>new Date(e).toLocaleTimeString()}),e.createElement(l,null),e.createElement(s,{labelFormatter:e=>new Date(e).toLocaleTimeString()}),e.createElement(m,{type:"monotone",dataKey:"activeComponents",stroke:"#8884d8",name:"Active Components"}),e.createElement(m,{type:"monotone",dataKey:"activeProps",stroke:"#82ca9d",name:"Active Props"}),e.createElement(m,{type:"monotone",dataKey:"highUpdateProps",stroke:"#ff7300",name:"High Update Props"}))),e.createElement("div",{className:h.section},e.createElement("h3",null,"Current Metrics"),e.createElement("div",{className:h["data-grid"]},e.createElement("div",{className:h["data-item"]},e.createElement("div",{className:h["data-label"]},"Components Tracked"),e.createElement("div",{className:h["data-value"],"data-testid":"component-count"},c.components.length)),e.createElement("div",{className:h["data-item"]},e.createElement("div",{className:h["data-label"]},"Props Monitored"),e.createElement("div",{className:h["data-value"],"data-testid":"props-count"},c.components.reduce(((e,t)=>e+t.props.length),0))),e.createElement("div",{className:h["data-item"]},e.createElement("div",{className:h["data-label"]},"Frequent Updates"),e.createElement("div",{className:h["data-value"],"data-testid":"updates-count"},c.frequentUpdates.length)))),d.length>0&&e.createElement("div",{className:h.section},e.createElement("h3",null,"Warnings"),e.createElement("ul",{"data-testid":"warnings-list"},d.map(((t,a)=>e.createElement("li",{key:a,className:h["performance-low"]},t))))))};
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */function g(e,t){var a={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(a[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(a[n[o]]=e[n[o]])}return a}const v=t=>{const{fill:a,entry:n}=t,o=g(t,["fill","entry"]),r="function"==typeof a?a(n):a;return e.createElement("rect",Object.assign({},o,{fill:r}))},y=({data:t})=>{const a=(()=>{const e=[];return t.components.forEach((t=>{const a=t.props.reduce(((e,t)=>e+(t.valueChanges||0)),0)/t.props.length,n=t.props.filter((e=>(e.valueChanges||0)/(e.usageCount||1)>.5)),o=t.props.filter((e=>(e.valueChanges||0)/(e.usageCount||1)<.2));if(n.length>0&&o.length>0&&e.push({componentName:t.componentName,type:"memoization",impact:"high",description:`Consider using React.memo with a custom comparison function to prevent unnecessary re-renders. ${o.length} props are stable while ${n.length} props update frequently.`,codeExample:`\nconst ${t.componentName} = React.memo(({ ${n.map((e=>e.name)).join(", ")} }) => {\n  // Component implementation\n}, (prevProps, nextProps) => {\n  ${n.map((e=>`// Only re-render if ${e.name} has changed\n  if (prevProps.${e.name} !== nextProps.${e.name}) return false;`)).join("\n  ")}\n  return true;\n});`,affectedProps:n.map((e=>e.name))}),t.props.length>5){const a=t.props.filter((e=>"object"===e.type||"array"===e.type));a.length>=3&&e.push({componentName:t.componentName,type:"propsGrouping",impact:"medium",description:"Consider grouping related props into a single object prop to improve maintainability and reduce prop drilling.",codeExample:`\n// Before\ninterface ${t.componentName}Props {\n  ${a.map((e=>`${e.name}: ${e.type};`)).join("\n  ")}\n}\n\n// After\ninterface ${t.componentName}Config {\n  ${a.map((e=>`${e.name}: ${e.type};`)).join("\n  ")}\n}\n\ninterface ${t.componentName}Props {\n  config: ${t.componentName}Config;\n}`,affectedProps:a.map((e=>e.name))})}if(a>5){const a=t.props.filter((e=>e.name.match(/^(set|update|change)/i)&&"function"===e.type));a.length>=2&&e.push({componentName:t.componentName,type:"stateManagement",impact:"medium",description:"Consider using a reducer to manage related state updates and improve state management predictability.",codeExample:`\ninterface ${t.componentName}State {\n  ${a.map((e=>`${e.name.replace(/^set|Update|Change/i,"").toLowerCase()}: any;`)).join("\n  ")}\n}\n\ntype ${t.componentName}Action = \n  ${a.map((e=>`| { type: '${e.name.replace(/^set|Update|Change/i,"")}'; payload: any }`)).join("\n  ")};\n\nfunction ${t.componentName.toLowerCase()}Reducer(\n  state: ${t.componentName}State,\n  action: ${t.componentName}Action\n): ${t.componentName}State {\n  switch (action.type) {\n    ${a.map((e=>`\n    case '${e.name.replace(/^set|Update|Change/i,"")}':\n      return { ...state, ${e.name.replace(/^set|Update|Change/i,"").toLowerCase()}: action.payload };`)).join("\n")}\n    default:\n      return state;\n  }\n}`,affectedProps:a.map((e=>e.name))})}})),e})(),n=a.map((e=>({name:e.componentName,value:"high"===e.impact?3:"medium"===e.impact?2:1,impact:e.impact})));return e.createElement("div",{className:h.container},e.createElement("h2",null,"Optimization Recommendations"),a.length>0?e.createElement(e.Fragment,null,e.createElement("div",{className:h["chart-container"]},e.createElement(c,{width:800,height:300,data:n},e.createElement(o,{strokeDasharray:"3 3"}),e.createElement(r,{dataKey:"name"}),e.createElement(l,null),e.createElement(s,null),e.createElement(i,{dataKey:"value",shape:e.createElement(v,{fill:e=>(e=>{switch(e){case"high":return"#ef5350";case"medium":return"#ff9800";default:return"#4caf50"}})(e.impact)})}))),e.createElement("div",{className:h.section},a.map(((t,a)=>e.createElement("div",{key:a,className:h["data-item"]},e.createElement("h3",null,t.componentName),e.createElement("div",{className:h[`performance-${t.impact}`]},t.impact.toUpperCase()," Impact"),e.createElement("p",null,t.description),e.createElement("pre",null,e.createElement("code",null,t.codeExample)),e.createElement("div",null,e.createElement("strong",null,"Affected Props:")," ",t.affectedProps.join(", "))))))):e.createElement("p",null,"No optimization suggestions available."))},f=({data:t})=>{const a=t.components.map((e=>{const a=e.props.reduce(((e,t)=>e+(t.valueChanges||0)),0),n=e.props.map((e=>({name:e.name,size:e.valueChanges||0}))),o=t.components.filter((t=>t.componentName!==e.componentName)).filter((t=>t.props.some((t=>e.props.some((e=>e.name===t.name)))))).map((e=>e.componentName));return{name:e.componentName,size:a,children:[...n,...o.map((e=>({name:`Affects: ${e}`,size:1})))]}}));return e.createElement("div",{className:h.container,"data-testid":"render-impact-analysis"},e.createElement("h2",null,"Render Impact Analysis"),e.createElement("div",{className:h.section},e.createElement("h3",null,"Component Update Relationships"),e.createElement("div",{className:h["chart-container"]},e.createElement(p,{width:800,height:400,data:a,dataKey:"size",stroke:"#fff",fill:"#8884d8"},e.createElement(s,{content:({payload:t})=>{if(!(null==t?void 0:t.length))return null;const a=t[0].payload;return e.createElement("div",{className:h.tooltip},e.createElement("div",null,a.name),e.createElement("div",null,"Updates: ",a.size))}})))),e.createElement("div",{className:h.section},e.createElement("h3",null,"Impact Analysis"),e.createElement("div",{className:h["data-grid"]},t.components.map((a=>{const n=a.props.reduce(((e,t)=>e+(t.valueChanges||0)),0),o=a.props.filter((e=>(e.valueChanges||0)/(e.usageCount||1)>.5)).map((e=>({name:e.name,updateCount:e.valueChanges||0}))),r=t.components.filter((e=>e.componentName!==a.componentName)).filter((e=>e.props.some((e=>a.props.some((t=>t.name===e.name)))))).map((e=>e.componentName));return e.createElement("div",{key:a.componentName,className:h["data-item"]},e.createElement("h4",null,a.componentName),e.createElement("div",null,e.createElement("strong",null,"Total Updates:")," ",n),o.length>0&&e.createElement("div",null,e.createElement("strong",null,"High Impact Props:"),e.createElement("ul",null,o.map((t=>e.createElement("li",{key:t.name},t.name," (",t.updateCount," updates)"))))),r.length>0&&e.createElement("div",null,e.createElement("strong",null,"Affects Components:"),e.createElement("ul",null,r.map((t=>e.createElement("li",{key:t},t))))))})))))},N=({data:c})=>{var i,p;const[d,E]=t(""),[g,v]=t(""),[y,f]=t([]);a((()=>{const e=u.getInstance().subscribe((e=>{if("update"===e.type){const t=e.data;if(d&&g){const e=t.components.find((e=>e.componentName===d)),a=null==e?void 0:e.props.find((e=>e.name===g));void 0!==(null==a?void 0:a.lastValue)&&f((e=>e.find((e=>e.componentName===d&&e.propName===g))?e.map((e=>e.componentName===d&&e.propName===g?Object.assign(Object.assign({},e),{history:[...e.history,{timestamp:Date.now(),value:a.lastValue,renderCount:a.usageCount||0}]}):e)):[...e,{componentName:d,propName:g,history:[{timestamp:Date.now(),value:a.lastValue,renderCount:a.usageCount||0}]}]))}}}));return()=>e()}),[d,g]);const N=e=>null===e?"null":void 0===e?"undefined":"object"==typeof e?JSON.stringify(e):String(e);return e.createElement("div",{className:h.container},e.createElement("h2",null,"Prop Value History"),e.createElement("div",{className:h.section},e.createElement("div",null,e.createElement("label",null,"Component:",e.createElement("select",{value:d,onChange:e=>E(e.target.value)},e.createElement("option",{value:""},"Select a component"),Array.from(new Set(c.components.map((e=>e.componentName)))).map((t=>e.createElement("option",{key:t,value:t},t)))))),d&&e.createElement("div",null,e.createElement("label",null,"Prop:",e.createElement("select",{value:g,onChange:e=>v(e.target.value)},e.createElement("option",{value:""},"Select a prop"),(e=>{const t=c.components.find((t=>t.componentName===e));return(null==t?void 0:t.props.map((e=>e.name)))||[]})(d).map((t=>e.createElement("option",{key:t,value:t},t))))))),d&&g&&e.createElement("div",{className:h.section},e.createElement("h3",null,"Value History"),e.createElement("div",{className:h["chart-container"]},e.createElement(n,{width:800,height:400,data:(null===(i=y.find((e=>e.componentName===d&&e.propName===g)))||void 0===i?void 0:i.history)||[]},e.createElement(o,{strokeDasharray:"3 3"}),e.createElement(r,{dataKey:"timestamp",tickFormatter:e=>new Date(e).toLocaleTimeString()}),e.createElement(l,null),e.createElement(s,{labelFormatter:e=>new Date(e).toLocaleTimeString(),formatter:e=>[N(e),"Value"]}),e.createElement(m,{type:"monotone",dataKey:"renderCount",stroke:"#8884d8",name:"Render Count"}))),e.createElement("div",{className:h["data-grid"]},null===(p=y.find((e=>e.componentName===d&&e.propName===g)))||void 0===p?void 0:p.history.slice(-5).map(((t,a)=>e.createElement("div",{key:a,className:h["data-item"]},e.createElement("div",{className:h["data-label"]},new Date(t.timestamp).toLocaleTimeString()),e.createElement("div",{className:h["data-value"]},N(t.value)),e.createElement("div",null,"Render Count: ",t.renderCount)))))))},C=t=>{const{fill:a,entry:n}=t,o=g(t,["fill","entry"]),r=(()=>{switch(n.type){case"update":return"#ef5350";case"value":return"#4caf50";default:return"#ff9800"}})();return e.createElement("rect",Object.assign({},o,{fill:r}))},b=({data:t})=>{const a=(()=>{const e=[],a=t.components.flatMap((e=>e.props.filter((e=>(e.valueChanges||0)/(e.usageCount||1)>.7)).map((t=>({componentName:e.componentName,propName:t.name,updateCount:t.valueChanges||0})))));a.length>0&&e.push({name:"Frequent Updates",components:[...new Set(a.map((e=>e.componentName)))],props:a.map((e=>`${e.componentName}.${e.propName}`)),frequency:a.length,type:"update"}),t.unusedProps.length>0&&e.push({name:"Unused Props",components:[...new Set(t.unusedProps.map((e=>e.componentName)))],props:t.unusedProps.map((e=>`${e.componentName}.${e.propName}`)),frequency:t.unusedProps.length,type:"unused"});const n=new Map;return t.components.forEach((e=>{e.props.forEach((a=>{const o=`${e.componentName}.${a.name}`;n.has(o)||n.set(o,new Set),t.components.forEach((e=>{e.props.forEach((t=>{if(a.valueChanges&&t.valueChanges){Math.abs(a.valueChanges-t.valueChanges)/a.valueChanges<.2&&n.get(o).add(`${e.componentName}.${t.name}`)}}))}))}))})),n.size>0&&e.push({name:"Prop Dependencies",components:[...new Set([...n.keys()].map((e=>e.split(".")[0])))],props:[...n.keys()],frequency:n.size,type:"value"}),e})(),n=a.map((e=>({name:e.name,value:e.frequency,type:e.type})));return e.createElement("div",{className:h.container},e.createElement("h2",null,"Prop Pattern Detection"),e.createElement("div",{className:h.section},e.createElement("h3",null,"Detected Patterns"),e.createElement("div",{className:h["chart-container"]},e.createElement(c,{width:800,height:300,data:n},e.createElement(o,{strokeDasharray:"3 3"}),e.createElement(r,{dataKey:"name"}),e.createElement(l,null),e.createElement(s,null),e.createElement(i,{dataKey:"value",shape:e.createElement(C,null)})))),e.createElement("div",{className:h.section},a.map(((t,a)=>e.createElement("div",{key:a,className:h["data-item"]},e.createElement("h3",null,t.name),e.createElement("div",null,e.createElement("strong",null,"Frequency:")," ",t.frequency),e.createElement("div",null,e.createElement("strong",null,"Affected Components:"),e.createElement("ul",null,t.components.map((t=>e.createElement("li",{key:t},t))))),e.createElement("div",null,e.createElement("strong",null,"Affected Props:"),e.createElement("ul",null,t.props.map((t=>e.createElement("li",{key:t},t))))))))))},w=({data:t})=>{const a=t.components.flatMap((e=>e.props.map((t=>({componentName:e.componentName,propName:t.name,timestamp:Date.now()-1e3*(t.valueChanges||0),type:"update",value:t.lastValue}))))).sort(((e,t)=>e.timestamp-t.timestamp));return e.createElement("div",{className:h.container},e.createElement("h2",null,"Prop Timeline"),e.createElement("div",{className:h.section},e.createElement("h3",null,"Component Updates Over Time"),e.createElement("div",{className:h["chart-container"]},e.createElement(n,{width:800,height:400,data:a},e.createElement(o,{strokeDasharray:"3 3"}),e.createElement(r,{dataKey:"timestamp",tickFormatter:e=>new Date(e).toLocaleTimeString()}),e.createElement(l,{dataKey:"componentName"}),e.createElement(s,{labelFormatter:e=>new Date(e).toLocaleTimeString(),formatter:(e,t)=>"value"===t?null===e?"null":void 0===e?"undefined":"object"==typeof e?JSON.stringify(e):String(e):e}),e.createElement(m,{type:"monotone",dataKey:"value",stroke:"#8884d8",name:"Value"})))),e.createElement("div",{className:h.section},e.createElement("h3",null,"Recent Updates"),e.createElement("div",{className:h["data-grid"]},a.slice(-5).map(((t,a)=>e.createElement("div",{key:a,className:h["data-item"]},e.createElement("div",{className:h["data-label"]},new Date(t.timestamp).toLocaleTimeString()),e.createElement("div",null,e.createElement("strong",null,t.componentName)),e.createElement("div",null,t.propName,": ",void 0!==t.value?String(t.value):"undefined"),e.createElement("div",{className:h[`performance-${t.type}`]},t.type.toUpperCase())))))))},_=({data:c})=>{const[i,p]=t([]),[d,E]=t([]);return a((()=>{const e=u.getInstance().subscribe((e=>{var t;if("update"===e.type){const a=e.data,n={timestamp:Date.now(),renderCount:a.components.reduce(((e,t)=>e+t.props.reduce(((e,t)=>e+(t.usageCount||0)),0)),0),propUpdateCount:a.components.reduce(((e,t)=>e+t.props.reduce(((e,t)=>e+(t.valueChanges||0)),0)),0),memoryUsage:(null===(t=performance.memory)||void 0===t?void 0:t.usedJSHeapSize)||0};p((e=>[...e,n].slice(-60)))}else"warning"===e.type&&E((t=>[...t,e.data.message]))}));return()=>e()}),[]),e.createElement("div",{className:h.container},e.createElement("h2",null,"Real-time Monitoring"),e.createElement("div",{className:h.section},e.createElement("h3",null,"Performance Metrics"),e.createElement("div",{className:h["chart-container"]},e.createElement(n,{width:800,height:400,data:i},e.createElement(o,{strokeDasharray:"3 3"}),e.createElement(r,{dataKey:"timestamp",tickFormatter:e=>new Date(e).toLocaleTimeString()}),e.createElement(l,null),e.createElement(s,{labelFormatter:e=>new Date(e).toLocaleTimeString()}),e.createElement(m,{type:"monotone",dataKey:"renderCount",stroke:"#8884d8",name:"Render Count"}),e.createElement(m,{type:"monotone",dataKey:"propUpdateCount",stroke:"#82ca9d",name:"Prop Updates"}),e.createElement(m,{type:"monotone",dataKey:"memoryUsage",stroke:"#ff7300",name:"Memory Usage (bytes)"})))),e.createElement("div",{className:h.section},e.createElement("h3",null,"Current Stats"),e.createElement("div",{className:h["data-grid"]},e.createElement("div",{className:h["data-item"]},e.createElement("div",{className:h["data-label"]},"Total Components"),e.createElement("div",{className:h["data-value"]},c.components.length)),e.createElement("div",{className:h["data-item"]},e.createElement("div",{className:h["data-label"]},"Total Props"),e.createElement("div",{className:h["data-value"]},c.components.reduce(((e,t)=>e+t.props.length),0))),e.createElement("div",{className:h["data-item"]},e.createElement("div",{className:h["data-label"]},"Update Rate"),e.createElement("div",{className:h["data-value"]},i.length>1?Math.round((i[i.length-1].propUpdateCount-i[i.length-2].propUpdateCount)/((i[i.length-1].timestamp-i[i.length-2].timestamp)/1e3)):0," updates/s")))),d.length>0&&e.createElement("div",{className:h.section},e.createElement("h3",null,"Alerts"),e.createElement("ul",null,d.map(((t,a)=>e.createElement("li",{key:a,className:h["performance-low"]},t))))))},P=({data:t})=>{const a=(e,t)=>{const a=e/t;return a>.75?"high":a>.5?"medium":"low"},n=t.components.map((e=>{const t=e.props.reduce(((e,t)=>e+(t.valueChanges||0)),0),n=e.props.map((e=>({name:e.name,value:e.valueChanges||0,impact:a(e.valueChanges||0,e.usageCount||1)})));return{name:e.componentName,value:t,impact:a(t,e.props.reduce(((e,t)=>e+(t.usageCount||1)),0)),children:n}}));return e.createElement("div",{className:h.container},e.createElement("h2",null,"Performance Impact Analysis"),e.createElement("div",{className:h.section},e.createElement("h3",null,"Component Impact Overview"),e.createElement("div",{className:h["chart-container"]},e.createElement(p,{width:800,height:400,data:n,dataKey:"value",stroke:"#fff",fill:"#8884d8"},e.createElement(s,{content:({payload:t})=>{if(!(null==t?void 0:t.length))return null;const a=t[0].payload;return e.createElement("div",{className:h.tooltip},e.createElement("div",null,a.name),e.createElement("div",null,"Updates: ",a.value),e.createElement("div",null,"Impact: ",a.impact.toUpperCase()))}})))),e.createElement("div",{className:h.section},e.createElement("h3",null,"Impact Details"),e.createElement("div",{className:h["data-grid"]},n.map((t=>e.createElement("div",{key:t.name,className:h["data-item"]},e.createElement("h4",null,t.name),e.createElement("div",{className:h[`performance-${t.impact}`]},"Impact: ",t.impact.toUpperCase()),e.createElement("div",null,e.createElement("strong",null,"Total Updates:")," ",t.value),t.children&&t.children.length>0&&e.createElement("div",null,e.createElement("strong",null,"Props by Impact:"),e.createElement("ul",null,t.children.sort(((e,t)=>t.value-e.value)).map((t=>e.createElement("li",{key:t.name},t.name,": ",t.value," updates",e.createElement("span",{className:h[`performance-${t.impact}`]}," ","(",t.impact,")"))))))))))))};function k(e){if("development"!==process.env.NODE_ENV)return;const{target:t,features:a=["monitoring","optimization","analysis"],theme:n="light",position:o={x:0,y:0}}=e;u.getInstance().startMonitoring();const r=document.createElement("div");if(r.id="fraop-dev-tools",r.style.position="fixed",r.style.top=`${o.y}px`,r.style.right=`${o.x}px`,r.style.zIndex="9999",r.style.backgroundColor="dark"===n?"#1e1e1e":"#ffffff",r.style.boxShadow="0 0 10px rgba(0,0,0,0.1)",r.style.borderRadius="4px",r.style.padding="16px",r.style.width="400px",r.style.height="600px",r.style.overflow="auto",r.classList.add(`fraop-theme-${n}`),a.includes("monitoring")){const e=document.createElement("div");e.id="fraop-monitoring-dashboard",r.appendChild(e)}t.appendChild(r),e.plugins&&e.plugins.forEach((e=>{var t;try{null===(t=e.init)||void 0===t||t.call(e)}catch(t){console.error(`Failed to initialize plugin: ${e.name}`,t)}})),console.log("Dev tools initialized with config:",e)}export{E as MonitoringDashboard,u as MonitoringService,y as OptimizationRecommendations,P as PerformanceImpact,d as PropAnalyzer,b as PropPatternDetection,w as PropTimeline,N as PropValueHistory,_ as RealTimeMonitoring,f as RenderImpactAnalysis,k as initDevTools};
//# sourceMappingURL=index.esm.js.map
