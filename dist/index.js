"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("react"),t=require("recharts");function a(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var n=a(e);class l{constructor(){this.componentCache=new Map,this.renderCount=new Map,this.memoizedAnalysis=null,this.lastAnalysisTimestamp=0,this.lastUpdateTimestamp=0,this.batchedUpdates=new Map,this.CACHE_THRESHOLD=1e3,this.BATCH_THRESHOLD=16}trackPropUsage(e,t,a){this.lastUpdateTimestamp=Date.now(),this.batchedUpdates.has(a)||this.batchedUpdates.set(a,new Set),Object.keys(t).forEach((e=>this.batchedUpdates.get(a).add(e))),this.shouldProcessBatch()&&this.processBatchedUpdates();let n=this.componentCache.get(a);n||(n={componentName:a,props:[]},this.componentCache.set(a,n)),this.renderCount.set(a,(this.renderCount.get(a)||0)+1),Object.entries(t).forEach((([t,a])=>{const l=n.props.find((e=>e.name===t));l?(l.usageCount++,this.areValuesEqual(a,l.lastValue)||(l.valueChanges=(l.valueChanges||0)+1,l.lastValue=this.cloneValue(a))):n.props.push({name:t,type:this.getPropType(a),required:this.isRequired(e,t),usageCount:1,defaultValue:this.getDefaultValue(e,t),valueChanges:0,lastValue:this.cloneValue(a)})})),this.memoizedAnalysis=null}shouldProcessBatch(){return Date.now()-this.lastUpdateTimestamp>=this.BATCH_THRESHOLD}processBatchedUpdates(){this.batchedUpdates.clear()}areValuesEqual(e,t){if(e===t)return!0;if(typeof e!=typeof t)return!1;if("object"!=typeof e)return!1;if(null===e||null===t)return!1;if(Array.isArray(e)&&Array.isArray(t))return e.length===t.length&&e.every(((e,a)=>this.areValuesEqual(e,t[a])));const a=Object.keys(e),n=Object.keys(t);return a.length===n.length&&a.every((a=>this.areValuesEqual(e[a],t[a])))}cloneValue(e){return null==e||"object"!=typeof e?e:Array.isArray(e)?e.map((e=>this.cloneValue(e))):Object.fromEntries(Object.entries(e).map((([e,t])=>[e,this.cloneValue(t)])))}getPropType(e){return void 0===e?"undefined":null===e?"object":typeof e}isRequired(e,t){var a;return!!(null===(a=e.propTypes)||void 0===a?void 0:a[t])}getDefaultValue(e,t){var a;return null===(a=e.defaultProps)||void 0===a?void 0:a[t]}analyzeProps(){const e=Date.now();if(this.memoizedAnalysis&&e-this.lastAnalysisTimestamp<this.CACHE_THRESHOLD&&e-this.lastUpdateTimestamp>this.BATCH_THRESHOLD)return this.memoizedAnalysis;const t=Array.from(this.componentCache.values()),a=[],n=new Map,l=[];return t.forEach((e=>{const t=this.renderCount.get(e.componentName)||0;e.props.forEach((r=>{0===r.usageCount&&a.push({componentName:e.componentName,propName:r.name});const o=`${r.type}:${r.required?"required":"optional"}`,s=n.get(o)||{count:0,components:new Set};s.count++,s.components.add(e.componentName),n.set(o,s),r.valueChanges&&r.valueChanges>.5*t&&l.push({componentName:e.componentName,propName:r.name,updateCount:r.valueChanges})}))})),this.memoizedAnalysis={components:t,unusedProps:a,propPatterns:Array.from(n.entries()).map((([e,t])=>({pattern:e,count:t.count,components:Array.from(t.components)}))),frequentUpdates:l.sort(((e,t)=>t.updateCount-e.updateCount))},this.lastAnalysisTimestamp=e,this.memoizedAnalysis}getComponentPropUsage(e){return this.componentCache.get(e)}getRenderCount(e){return this.renderCount.get(e)||0}reset(){this.componentCache.clear(),this.renderCount.clear(),this.memoizedAnalysis=null,this.lastAnalysisTimestamp=0,this.lastUpdateTimestamp=0,this.batchedUpdates.clear()}}class r{constructor(){this.analyzer=new l,this.listeners=new Set,this.updateInterval=1e3}static getInstance(){return r.instance||(r.instance=new r),r.instance}startMonitoring(e){e&&(this.updateInterval=e),this.intervalId&&this.stopMonitoring(),this.intervalId=window.setInterval((()=>{try{const e=this.analyzer.analyzeProps();this.notifyListeners({type:"update",timestamp:Date.now(),data:e}),this.checkForWarnings(e)}catch(e){this.notifyListeners({type:"error",timestamp:Date.now(),data:e})}}),this.updateInterval)}stopMonitoring(){this.intervalId&&(window.clearInterval(this.intervalId),this.intervalId=void 0)}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}getAnalyzer(){return this.analyzer}notifyListeners(e){this.listeners.forEach((t=>{try{t(e)}catch(e){console.error("Error in monitoring listener:",e)}}))}checkForWarnings(e){const t=e.frequentUpdates.filter((e=>e.updateCount>100));t.length>0&&this.notifyListeners({type:"warning",timestamp:Date.now(),data:{message:"High frequency prop updates detected",components:t}}),e.unusedProps.length>0&&this.notifyListeners({type:"warning",timestamp:Date.now(),data:{message:"Unused props detected",components:e.unusedProps}});const a=e.components.filter((e=>e.props.length>10));a.length>0&&this.notifyListeners({type:"warning",timestamp:Date.now(),data:{message:"Components with many props detected",components:a.map((e=>({name:e.componentName,propCount:e.props.length})))}})}}var o={container:"base-module_container__N-VTj","node-component":"base-module_node-component__3R2-B","node-prop":"base-module_node-prop__6bpoO","link-dependency":"base-module_link-dependency__t58B6","link-update":"base-module_link-update__fj1Pw",chartContainer:"base-module_chartContainer__lcs0d",tooltip:"base-module_tooltip__c9I89",performanceHigh:"base-module_performanceHigh__Hnxwi",performanceMedium:"base-module_performanceMedium__jYlB7",performanceLow:"base-module_performanceLow__RWfP-",section:"base-module_section__l0hua","section-title":"base-module_section-title__GYBoP","section-content":"base-module_section-content__s8HOk",button:"base-module_button__yooH5",buttonActive:"base-module_buttonActive__yBKXk",dataGrid:"base-module_dataGrid__cMCBW",dataItem:"base-module_dataItem__S-ukG",dataLabel:"base-module_dataLabel__-otSE",dataValue:"base-module_dataValue__wYuSW"};
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
***************************************************************************** */
function s(e,t){var a={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(a[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var l=0;for(n=Object.getOwnPropertySymbols(e);l<n.length;l++)t.indexOf(n[l])<0&&Object.prototype.propertyIsEnumerable.call(e,n[l])&&(a[n[l]]=e[n[l]])}return a}const m=e=>{const{fill:t,entry:a}=e,l=s(e,["fill","entry"]),r="function"==typeof t?t(a):t;return n.default.createElement("rect",Object.assign({},l,{fill:r}))},c=e=>{const{fill:t,entry:a}=e,l=s(e,["fill","entry"]),r=(()=>{switch(a.type){case"update":return"#ef5350";case"value":return"#4caf50";default:return"#ff9800"}})();return n.default.createElement("rect",Object.assign({},l,{fill:r}))};exports.MonitoringDashboard=({data:a})=>{const[l,s]=e.useState([]),[m,c]=e.useState([]);e.useEffect((()=>{const e=r.getInstance().subscribe((e=>{if("update"===e.type){const t=e.data,a=i(t);s((e=>[...e,a].slice(-60)))}else"warning"===e.type&&c((t=>[...t,e.data.message]))}));return()=>e()}),[]);const i=e=>{const t=e.components.length,a=e.components.reduce(((e,t)=>e+t.props.filter((e=>e.usageCount>0)).length),0),n=e.components.reduce(((e,t)=>e+t.props.filter((e=>(e.valueChanges||0)/(e.usageCount||1)>.5)).length),0);return{timestamp:Date.now(),activeComponents:t,activeProps:a,highUpdateProps:n}};return n.default.createElement("div",{className:o.container,"data-testid":"monitoring-dashboard"},n.default.createElement("h2",null,"Real-time Monitoring"),n.default.createElement("div",{className:o["chart-container"]},n.default.createElement(t.LineChart,{width:800,height:400,data:l},n.default.createElement(t.CartesianGrid,{strokeDasharray:"3 3"}),n.default.createElement(t.XAxis,{dataKey:"timestamp",tickFormatter:e=>new Date(e).toLocaleTimeString()}),n.default.createElement(t.YAxis,null),n.default.createElement(t.Tooltip,{labelFormatter:e=>new Date(e).toLocaleTimeString()}),n.default.createElement(t.Line,{type:"monotone",dataKey:"activeComponents",stroke:"#8884d8",name:"Active Components"}),n.default.createElement(t.Line,{type:"monotone",dataKey:"activeProps",stroke:"#82ca9d",name:"Active Props"}),n.default.createElement(t.Line,{type:"monotone",dataKey:"highUpdateProps",stroke:"#ff7300",name:"High Update Props"}))),n.default.createElement("div",{className:o.section},n.default.createElement("h3",null,"Current Metrics"),n.default.createElement("div",{className:o["data-grid"]},n.default.createElement("div",{className:o["data-item"]},n.default.createElement("div",{className:o["data-label"]},"Components Tracked"),n.default.createElement("div",{className:o["data-value"],"data-testid":"component-count"},a.components.length)),n.default.createElement("div",{className:o["data-item"]},n.default.createElement("div",{className:o["data-label"]},"Props Monitored"),n.default.createElement("div",{className:o["data-value"],"data-testid":"props-count"},a.components.reduce(((e,t)=>e+t.props.length),0))),n.default.createElement("div",{className:o["data-item"]},n.default.createElement("div",{className:o["data-label"]},"Frequent Updates"),n.default.createElement("div",{className:o["data-value"],"data-testid":"updates-count"},a.frequentUpdates.length)))),m.length>0&&n.default.createElement("div",{className:o.section},n.default.createElement("h3",null,"Warnings"),n.default.createElement("ul",{"data-testid":"warnings-list"},m.map(((e,t)=>n.default.createElement("li",{key:t,className:o["performance-low"]},e))))))},exports.MonitoringService=r,exports.OptimizationRecommendations=({data:e})=>{const a=(()=>{const t=[];return e.components.forEach((e=>{const a=e.props.reduce(((e,t)=>e+(t.valueChanges||0)),0)/e.props.length,n=e.props.filter((e=>(e.valueChanges||0)/(e.usageCount||1)>.5)),l=e.props.filter((e=>(e.valueChanges||0)/(e.usageCount||1)<.2));if(n.length>0&&l.length>0&&t.push({componentName:e.componentName,type:"memoization",impact:"high",description:`Consider using React.memo with a custom comparison function to prevent unnecessary re-renders. ${l.length} props are stable while ${n.length} props update frequently.`,codeExample:`\nconst ${e.componentName} = React.memo(({ ${n.map((e=>e.name)).join(", ")} }) => {\n  // Component implementation\n}, (prevProps, nextProps) => {\n  ${n.map((e=>`// Only re-render if ${e.name} has changed\n  if (prevProps.${e.name} !== nextProps.${e.name}) return false;`)).join("\n  ")}\n  return true;\n});`,affectedProps:n.map((e=>e.name))}),e.props.length>5){const a=e.props.filter((e=>"object"===e.type||"array"===e.type));a.length>=3&&t.push({componentName:e.componentName,type:"propsGrouping",impact:"medium",description:"Consider grouping related props into a single object prop to improve maintainability and reduce prop drilling.",codeExample:`\n// Before\ninterface ${e.componentName}Props {\n  ${a.map((e=>`${e.name}: ${e.type};`)).join("\n  ")}\n}\n\n// After\ninterface ${e.componentName}Config {\n  ${a.map((e=>`${e.name}: ${e.type};`)).join("\n  ")}\n}\n\ninterface ${e.componentName}Props {\n  config: ${e.componentName}Config;\n}`,affectedProps:a.map((e=>e.name))})}if(a>5){const a=e.props.filter((e=>e.name.match(/^(set|update|change)/i)&&"function"===e.type));a.length>=2&&t.push({componentName:e.componentName,type:"stateManagement",impact:"medium",description:"Consider using a reducer to manage related state updates and improve state management predictability.",codeExample:`\ninterface ${e.componentName}State {\n  ${a.map((e=>`${e.name.replace(/^set|Update|Change/i,"").toLowerCase()}: any;`)).join("\n  ")}\n}\n\ntype ${e.componentName}Action = \n  ${a.map((e=>`| { type: '${e.name.replace(/^set|Update|Change/i,"")}'; payload: any }`)).join("\n  ")};\n\nfunction ${e.componentName.toLowerCase()}Reducer(\n  state: ${e.componentName}State,\n  action: ${e.componentName}Action\n): ${e.componentName}State {\n  switch (action.type) {\n    ${a.map((e=>`\n    case '${e.name.replace(/^set|Update|Change/i,"")}':\n      return { ...state, ${e.name.replace(/^set|Update|Change/i,"").toLowerCase()}: action.payload };`)).join("\n")}\n    default:\n      return state;\n  }\n}`,affectedProps:a.map((e=>e.name))})}})),t})(),l=a.map((e=>({name:e.componentName,value:"high"===e.impact?3:"medium"===e.impact?2:1,impact:e.impact})));return n.default.createElement("div",{className:o.container},n.default.createElement("h2",null,"Optimization Recommendations"),a.length>0?n.default.createElement(n.default.Fragment,null,n.default.createElement("div",{className:o["chart-container"]},n.default.createElement(t.BarChart,{width:800,height:300,data:l},n.default.createElement(t.CartesianGrid,{strokeDasharray:"3 3"}),n.default.createElement(t.XAxis,{dataKey:"name"}),n.default.createElement(t.YAxis,null),n.default.createElement(t.Tooltip,null),n.default.createElement(t.Bar,{dataKey:"value",shape:n.default.createElement(m,{fill:e=>(e=>{switch(e){case"high":return"#ef5350";case"medium":return"#ff9800";default:return"#4caf50"}})(e.impact)})}))),n.default.createElement("div",{className:o.section},a.map(((e,t)=>n.default.createElement("div",{key:t,className:o["data-item"]},n.default.createElement("h3",null,e.componentName),n.default.createElement("div",{className:o[`performance-${e.impact}`]},e.impact.toUpperCase()," Impact"),n.default.createElement("p",null,e.description),n.default.createElement("pre",null,n.default.createElement("code",null,e.codeExample)),n.default.createElement("div",null,n.default.createElement("strong",null,"Affected Props:")," ",e.affectedProps.join(", "))))))):n.default.createElement("p",null,"No optimization suggestions available."))},exports.PerformanceImpact=({data:e})=>{const a=(e,t)=>{const a=e/t;return a>.75?"high":a>.5?"medium":"low"},l=e.components.map((e=>{const t=e.props.reduce(((e,t)=>e+(t.valueChanges||0)),0),n=e.props.map((e=>({name:e.name,value:e.valueChanges||0,impact:a(e.valueChanges||0,e.usageCount||1)})));return{name:e.componentName,value:t,impact:a(t,e.props.reduce(((e,t)=>e+(t.usageCount||1)),0)),children:n}}));return n.default.createElement("div",{className:o.container},n.default.createElement("h2",null,"Performance Impact Analysis"),n.default.createElement("div",{className:o.section},n.default.createElement("h3",null,"Component Impact Overview"),n.default.createElement("div",{className:o["chart-container"]},n.default.createElement(t.Treemap,{width:800,height:400,data:l,dataKey:"value",stroke:"#fff",fill:"#8884d8"},n.default.createElement(t.Tooltip,{content:({payload:e})=>{if(!(null==e?void 0:e.length))return null;const t=e[0].payload;return n.default.createElement("div",{className:o.tooltip},n.default.createElement("div",null,t.name),n.default.createElement("div",null,"Updates: ",t.value),n.default.createElement("div",null,"Impact: ",t.impact.toUpperCase()))}})))),n.default.createElement("div",{className:o.section},n.default.createElement("h3",null,"Impact Details"),n.default.createElement("div",{className:o["data-grid"]},l.map((e=>n.default.createElement("div",{key:e.name,className:o["data-item"]},n.default.createElement("h4",null,e.name),n.default.createElement("div",{className:o[`performance-${e.impact}`]},"Impact: ",e.impact.toUpperCase()),n.default.createElement("div",null,n.default.createElement("strong",null,"Total Updates:")," ",e.value),e.children&&e.children.length>0&&n.default.createElement("div",null,n.default.createElement("strong",null,"Props by Impact:"),n.default.createElement("ul",null,e.children.sort(((e,t)=>t.value-e.value)).map((e=>n.default.createElement("li",{key:e.name},e.name,": ",e.value," updates",n.default.createElement("span",{className:o[`performance-${e.impact}`]}," ","(",e.impact,")"))))))))))))},exports.PropAnalyzer=l,exports.PropPatternDetection=({data:e})=>{const a=(()=>{const t=[],a=e.components.flatMap((e=>e.props.filter((e=>(e.valueChanges||0)/(e.usageCount||1)>.7)).map((t=>({componentName:e.componentName,propName:t.name,updateCount:t.valueChanges||0})))));a.length>0&&t.push({name:"Frequent Updates",components:[...new Set(a.map((e=>e.componentName)))],props:a.map((e=>`${e.componentName}.${e.propName}`)),frequency:a.length,type:"update"}),e.unusedProps.length>0&&t.push({name:"Unused Props",components:[...new Set(e.unusedProps.map((e=>e.componentName)))],props:e.unusedProps.map((e=>`${e.componentName}.${e.propName}`)),frequency:e.unusedProps.length,type:"unused"});const n=new Map;return e.components.forEach((t=>{t.props.forEach((a=>{const l=`${t.componentName}.${a.name}`;n.has(l)||n.set(l,new Set),e.components.forEach((e=>{e.props.forEach((t=>{if(a.valueChanges&&t.valueChanges){Math.abs(a.valueChanges-t.valueChanges)/a.valueChanges<.2&&n.get(l).add(`${e.componentName}.${t.name}`)}}))}))}))})),n.size>0&&t.push({name:"Prop Dependencies",components:[...new Set([...n.keys()].map((e=>e.split(".")[0])))],props:[...n.keys()],frequency:n.size,type:"value"}),t})(),l=a.map((e=>({name:e.name,value:e.frequency,type:e.type})));return n.default.createElement("div",{className:o.container},n.default.createElement("h2",null,"Prop Pattern Detection"),n.default.createElement("div",{className:o.section},n.default.createElement("h3",null,"Detected Patterns"),n.default.createElement("div",{className:o["chart-container"]},n.default.createElement(t.BarChart,{width:800,height:300,data:l},n.default.createElement(t.CartesianGrid,{strokeDasharray:"3 3"}),n.default.createElement(t.XAxis,{dataKey:"name"}),n.default.createElement(t.YAxis,null),n.default.createElement(t.Tooltip,null),n.default.createElement(t.Bar,{dataKey:"value",shape:n.default.createElement(c,null)})))),n.default.createElement("div",{className:o.section},a.map(((e,t)=>n.default.createElement("div",{key:t,className:o["data-item"]},n.default.createElement("h3",null,e.name),n.default.createElement("div",null,n.default.createElement("strong",null,"Frequency:")," ",e.frequency),n.default.createElement("div",null,n.default.createElement("strong",null,"Affected Components:"),n.default.createElement("ul",null,e.components.map((e=>n.default.createElement("li",{key:e},e))))),n.default.createElement("div",null,n.default.createElement("strong",null,"Affected Props:"),n.default.createElement("ul",null,e.props.map((e=>n.default.createElement("li",{key:e},e))))))))))},exports.PropTimeline=({data:e})=>{const a=e.components.flatMap((e=>e.props.map((t=>({componentName:e.componentName,propName:t.name,timestamp:Date.now()-1e3*(t.valueChanges||0),type:"update",value:t.lastValue}))))).sort(((e,t)=>e.timestamp-t.timestamp));return n.default.createElement("div",{className:o.container},n.default.createElement("h2",null,"Prop Timeline"),n.default.createElement("div",{className:o.section},n.default.createElement("h3",null,"Component Updates Over Time"),n.default.createElement("div",{className:o["chart-container"]},n.default.createElement(t.LineChart,{width:800,height:400,data:a},n.default.createElement(t.CartesianGrid,{strokeDasharray:"3 3"}),n.default.createElement(t.XAxis,{dataKey:"timestamp",tickFormatter:e=>new Date(e).toLocaleTimeString()}),n.default.createElement(t.YAxis,{dataKey:"componentName"}),n.default.createElement(t.Tooltip,{labelFormatter:e=>new Date(e).toLocaleTimeString(),formatter:(e,t)=>"value"===t?null===e?"null":void 0===e?"undefined":"object"==typeof e?JSON.stringify(e):String(e):e}),n.default.createElement(t.Line,{type:"monotone",dataKey:"value",stroke:"#8884d8",name:"Value"})))),n.default.createElement("div",{className:o.section},n.default.createElement("h3",null,"Recent Updates"),n.default.createElement("div",{className:o["data-grid"]},a.slice(-5).map(((e,t)=>n.default.createElement("div",{key:t,className:o["data-item"]},n.default.createElement("div",{className:o["data-label"]},new Date(e.timestamp).toLocaleTimeString()),n.default.createElement("div",null,n.default.createElement("strong",null,e.componentName)),n.default.createElement("div",null,e.propName,": ",void 0!==e.value?String(e.value):"undefined"),n.default.createElement("div",{className:o[`performance-${e.type}`]},e.type.toUpperCase())))))))},exports.PropValueHistory=({data:a})=>{var l,s;const[m,c]=e.useState(""),[i,d]=e.useState(""),[u,p]=e.useState([]);e.useEffect((()=>{const e=r.getInstance().subscribe((e=>{if("update"===e.type){const t=e.data;if(m&&i){const e=t.components.find((e=>e.componentName===m)),a=null==e?void 0:e.props.find((e=>e.name===i));void 0!==(null==a?void 0:a.lastValue)&&p((e=>e.find((e=>e.componentName===m&&e.propName===i))?e.map((e=>e.componentName===m&&e.propName===i?Object.assign(Object.assign({},e),{history:[...e.history,{timestamp:Date.now(),value:a.lastValue,renderCount:a.usageCount||0}]}):e)):[...e,{componentName:m,propName:i,history:[{timestamp:Date.now(),value:a.lastValue,renderCount:a.usageCount||0}]}]))}}}));return()=>e()}),[m,i]);const f=e=>null===e?"null":void 0===e?"undefined":"object"==typeof e?JSON.stringify(e):String(e);return n.default.createElement("div",{className:o.container},n.default.createElement("h2",null,"Prop Value History"),n.default.createElement("div",{className:o.section},n.default.createElement("div",null,n.default.createElement("label",null,"Component:",n.default.createElement("select",{value:m,onChange:e=>c(e.target.value)},n.default.createElement("option",{value:""},"Select a component"),Array.from(new Set(a.components.map((e=>e.componentName)))).map((e=>n.default.createElement("option",{key:e,value:e},e)))))),m&&n.default.createElement("div",null,n.default.createElement("label",null,"Prop:",n.default.createElement("select",{value:i,onChange:e=>d(e.target.value)},n.default.createElement("option",{value:""},"Select a prop"),(e=>{const t=a.components.find((t=>t.componentName===e));return(null==t?void 0:t.props.map((e=>e.name)))||[]})(m).map((e=>n.default.createElement("option",{key:e,value:e},e))))))),m&&i&&n.default.createElement("div",{className:o.section},n.default.createElement("h3",null,"Value History"),n.default.createElement("div",{className:o["chart-container"]},n.default.createElement(t.LineChart,{width:800,height:400,data:(null===(l=u.find((e=>e.componentName===m&&e.propName===i)))||void 0===l?void 0:l.history)||[]},n.default.createElement(t.CartesianGrid,{strokeDasharray:"3 3"}),n.default.createElement(t.XAxis,{dataKey:"timestamp",tickFormatter:e=>new Date(e).toLocaleTimeString()}),n.default.createElement(t.YAxis,null),n.default.createElement(t.Tooltip,{labelFormatter:e=>new Date(e).toLocaleTimeString(),formatter:e=>[f(e),"Value"]}),n.default.createElement(t.Line,{type:"monotone",dataKey:"renderCount",stroke:"#8884d8",name:"Render Count"}))),n.default.createElement("div",{className:o["data-grid"]},null===(s=u.find((e=>e.componentName===m&&e.propName===i)))||void 0===s?void 0:s.history.slice(-5).map(((e,t)=>n.default.createElement("div",{key:t,className:o["data-item"]},n.default.createElement("div",{className:o["data-label"]},new Date(e.timestamp).toLocaleTimeString()),n.default.createElement("div",{className:o["data-value"]},f(e.value)),n.default.createElement("div",null,"Render Count: ",e.renderCount)))))))},exports.RealTimeMonitoring=({data:a})=>{const[l,s]=e.useState([]),[m,c]=e.useState([]);return e.useEffect((()=>{const e=r.getInstance().subscribe((e=>{var t;if("update"===e.type){const a=e.data,n={timestamp:Date.now(),renderCount:a.components.reduce(((e,t)=>e+t.props.reduce(((e,t)=>e+(t.usageCount||0)),0)),0),propUpdateCount:a.components.reduce(((e,t)=>e+t.props.reduce(((e,t)=>e+(t.valueChanges||0)),0)),0),memoryUsage:(null===(t=performance.memory)||void 0===t?void 0:t.usedJSHeapSize)||0};s((e=>[...e,n].slice(-60)))}else"warning"===e.type&&c((t=>[...t,e.data.message]))}));return()=>e()}),[]),n.default.createElement("div",{className:o.container},n.default.createElement("h2",null,"Real-time Monitoring"),n.default.createElement("div",{className:o.section},n.default.createElement("h3",null,"Performance Metrics"),n.default.createElement("div",{className:o["chart-container"]},n.default.createElement(t.LineChart,{width:800,height:400,data:l},n.default.createElement(t.CartesianGrid,{strokeDasharray:"3 3"}),n.default.createElement(t.XAxis,{dataKey:"timestamp",tickFormatter:e=>new Date(e).toLocaleTimeString()}),n.default.createElement(t.YAxis,null),n.default.createElement(t.Tooltip,{labelFormatter:e=>new Date(e).toLocaleTimeString()}),n.default.createElement(t.Line,{type:"monotone",dataKey:"renderCount",stroke:"#8884d8",name:"Render Count"}),n.default.createElement(t.Line,{type:"monotone",dataKey:"propUpdateCount",stroke:"#82ca9d",name:"Prop Updates"}),n.default.createElement(t.Line,{type:"monotone",dataKey:"memoryUsage",stroke:"#ff7300",name:"Memory Usage (bytes)"})))),n.default.createElement("div",{className:o.section},n.default.createElement("h3",null,"Current Stats"),n.default.createElement("div",{className:o["data-grid"]},n.default.createElement("div",{className:o["data-item"]},n.default.createElement("div",{className:o["data-label"]},"Total Components"),n.default.createElement("div",{className:o["data-value"]},a.components.length)),n.default.createElement("div",{className:o["data-item"]},n.default.createElement("div",{className:o["data-label"]},"Total Props"),n.default.createElement("div",{className:o["data-value"]},a.components.reduce(((e,t)=>e+t.props.length),0))),n.default.createElement("div",{className:o["data-item"]},n.default.createElement("div",{className:o["data-label"]},"Update Rate"),n.default.createElement("div",{className:o["data-value"]},l.length>1?Math.round((l[l.length-1].propUpdateCount-l[l.length-2].propUpdateCount)/((l[l.length-1].timestamp-l[l.length-2].timestamp)/1e3)):0," updates/s")))),m.length>0&&n.default.createElement("div",{className:o.section},n.default.createElement("h3",null,"Alerts"),n.default.createElement("ul",null,m.map(((e,t)=>n.default.createElement("li",{key:t,className:o["performance-low"]},e))))))},exports.RenderImpactAnalysis=({data:e})=>{const a=e.components.map((t=>{const a=t.props.reduce(((e,t)=>e+(t.valueChanges||0)),0),n=t.props.map((e=>({name:e.name,size:e.valueChanges||0}))),l=e.components.filter((e=>e.componentName!==t.componentName)).filter((e=>e.props.some((e=>t.props.some((t=>t.name===e.name)))))).map((e=>e.componentName));return{name:t.componentName,size:a,children:[...n,...l.map((e=>({name:`Affects: ${e}`,size:1})))]}}));return n.default.createElement("div",{className:o.container,"data-testid":"render-impact-analysis"},n.default.createElement("h2",null,"Render Impact Analysis"),n.default.createElement("div",{className:o.section},n.default.createElement("h3",null,"Component Update Relationships"),n.default.createElement("div",{className:o["chart-container"]},n.default.createElement(t.Treemap,{width:800,height:400,data:a,dataKey:"size",stroke:"#fff",fill:"#8884d8"},n.default.createElement(t.Tooltip,{content:({payload:e})=>{if(!(null==e?void 0:e.length))return null;const t=e[0].payload;return n.default.createElement("div",{className:o.tooltip},n.default.createElement("div",null,t.name),n.default.createElement("div",null,"Updates: ",t.size))}})))),n.default.createElement("div",{className:o.section},n.default.createElement("h3",null,"Impact Analysis"),n.default.createElement("div",{className:o["data-grid"]},e.components.map((t=>{const a=t.props.reduce(((e,t)=>e+(t.valueChanges||0)),0),l=t.props.filter((e=>(e.valueChanges||0)/(e.usageCount||1)>.5)).map((e=>({name:e.name,updateCount:e.valueChanges||0}))),r=e.components.filter((e=>e.componentName!==t.componentName)).filter((e=>e.props.some((e=>t.props.some((t=>t.name===e.name)))))).map((e=>e.componentName));return n.default.createElement("div",{key:t.componentName,className:o["data-item"]},n.default.createElement("h4",null,t.componentName),n.default.createElement("div",null,n.default.createElement("strong",null,"Total Updates:")," ",a),l.length>0&&n.default.createElement("div",null,n.default.createElement("strong",null,"High Impact Props:"),n.default.createElement("ul",null,l.map((e=>n.default.createElement("li",{key:e.name},e.name," (",e.updateCount," updates)"))))),r.length>0&&n.default.createElement("div",null,n.default.createElement("strong",null,"Affects Components:"),n.default.createElement("ul",null,r.map((e=>n.default.createElement("li",{key:e},e))))))})))))},exports.initDevTools=function(e){if("development"!==process.env.NODE_ENV)return;const{target:t,features:a=["monitoring","optimization","analysis"],theme:n="light",position:l={x:0,y:0}}=e;r.getInstance().startMonitoring();const o=document.createElement("div");if(o.id="fraop-dev-tools",o.style.position="fixed",o.style.top=`${l.y}px`,o.style.right=`${l.x}px`,o.style.zIndex="9999",o.style.backgroundColor="dark"===n?"#1e1e1e":"#ffffff",o.style.boxShadow="0 0 10px rgba(0,0,0,0.1)",o.style.borderRadius="4px",o.style.padding="16px",o.style.width="400px",o.style.height="600px",o.style.overflow="auto",o.classList.add(`fraop-theme-${n}`),a.includes("monitoring")){const e=document.createElement("div");e.id="fraop-monitoring-dashboard",o.appendChild(e)}t.appendChild(o),e.plugins&&e.plugins.forEach((e=>{var t;try{null===(t=e.init)||void 0===t||t.call(e)}catch(t){console.error(`Failed to initialize plugin: ${e.name}`,t)}})),console.log("Dev tools initialized with config:",e)};
//# sourceMappingURL=index.js.map
