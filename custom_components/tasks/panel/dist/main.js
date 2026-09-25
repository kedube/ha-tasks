var hi=Object.defineProperty;var Jr=Object.getOwnPropertyDescriptor;var W=(e,i)=>{for(var t in i)hi(e,t,{get:i[t],enumerable:!0})};var h=(e,i,t,r)=>{for(var a=r>1?void 0:r?Jr(i,t):i,n=e.length-1,o;n>=0;n--)(o=e[n])&&(a=(r?o(i,t,a):o(a))||a);return r&&a&&hi(i,t,a),a};var je=globalThis,Ve=je.ShadowRoot&&(je.ShadyCSS===void 0||je.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ct=Symbol(),mi=new WeakMap,Ee=class{constructor(i,t,r){if(this._$cssResult$=!0,r!==Ct)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=t}get styleSheet(){let i=this.o,t=this.t;if(Ve&&i===void 0){let r=t!==void 0&&t.length===1;r&&(i=mi.get(t)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),r&&mi.set(t,i))}return i}toString(){return this.cssText}},gi=e=>new Ee(typeof e=="string"?e:e+"",void 0,Ct),D=(e,...i)=>{let t=e.length===1?e[0]:i.reduce((r,a,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[n+1],e[0]);return new Ee(t,e,Ct)},fi=(e,i)=>{if(Ve)e.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of i){let r=document.createElement("style"),a=je.litNonce;a!==void 0&&r.setAttribute("nonce",a),r.textContent=t.cssText,e.appendChild(r)}},Dt=Ve?e=>e:e=>e instanceof CSSStyleSheet?(i=>{let t="";for(let r of i.cssRules)t+=r.cssText;return gi(t)})(e):e;var{is:Kr,defineProperty:Qr,getOwnPropertyDescriptor:ea,getOwnPropertyNames:ta,getOwnPropertySymbols:ia,getPrototypeOf:ra}=Object,Z=globalThis,_i=Z.trustedTypes,aa=_i?_i.emptyScript:"",na=Z.reactiveElementPolyfillSupport,Se=(e,i)=>e,Ae={toAttribute(e,i){switch(i){case Boolean:e=e?aa:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,i){let t=e;switch(i){case Boolean:t=e!==null;break;case Number:t=e===null?null:Number(e);break;case Object:case Array:try{t=JSON.parse(e)}catch{t=null}}return t}},qe=(e,i)=>!Kr(e,i),vi={attribute:!0,type:String,converter:Ae,reflect:!1,useDefault:!1,hasChanged:qe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Z.litPropertyMetadata??(Z.litPropertyMetadata=new WeakMap);var M=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??(this.l=[])).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,t=vi){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(i,t),!t.noAccessor){let r=Symbol(),a=this.getPropertyDescriptor(i,r,t);a!==void 0&&Qr(this.prototype,i,a)}}static getPropertyDescriptor(i,t,r){let{get:a,set:n}=ea(this.prototype,i)??{get(){return this[t]},set(o){this[t]=o}};return{get:a,set(o){let s=a?.call(this);n?.call(this,o),this.requestUpdate(i,s,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??vi}static _$Ei(){if(this.hasOwnProperty(Se("elementProperties")))return;let i=ra(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(Se("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Se("properties"))){let t=this.properties,r=[...ta(t),...ia(t)];for(let a of r)this.createProperty(a,t[a])}let i=this[Symbol.metadata];if(i!==null){let t=litPropertyMetadata.get(i);if(t!==void 0)for(let[r,a]of t)this.elementProperties.set(r,a)}this._$Eh=new Map;for(let[t,r]of this.elementProperties){let a=this._$Eu(t,r);a!==void 0&&this._$Eh.set(a,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){let t=[];if(Array.isArray(i)){let r=new Set(i.flat(1/0).reverse());for(let a of r)t.unshift(Dt(a))}else i!==void 0&&t.push(Dt(i));return t}static _$Eu(i,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??(this._$EO=new Set)).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){let i=new Map,t=this.constructor.elementProperties;for(let r of t.keys())this.hasOwnProperty(r)&&(i.set(r,this[r]),delete this[r]);i.size>0&&(this._$Ep=i)}createRenderRoot(){let i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fi(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,t,r){this._$AK(i,r)}_$ET(i,t){let r=this.constructor.elementProperties.get(i),a=this.constructor._$Eu(i,r);if(a!==void 0&&r.reflect===!0){let n=(r.converter?.toAttribute!==void 0?r.converter:Ae).toAttribute(t,r.type);this._$Em=i,n==null?this.removeAttribute(a):this.setAttribute(a,n),this._$Em=null}}_$AK(i,t){let r=this.constructor,a=r._$Eh.get(i);if(a!==void 0&&this._$Em!==a){let n=r.getPropertyOptions(a),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Ae;this._$Em=a;let s=o.fromAttribute(t,n.type);this[a]=s??this._$Ej?.get(a)??s,this._$Em=null}}requestUpdate(i,t,r,a=!1,n){if(i!==void 0){let o=this.constructor;if(a===!1&&(n=this[i]),r??(r=o.getPropertyOptions(i)),!((r.hasChanged??qe)(n,t)||r.useDefault&&r.reflect&&n===this._$Ej?.get(i)&&!this.hasAttribute(o._$Eu(i,r))))return;this.C(i,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,t,{useDefault:r,reflect:a,wrapped:n},o){r&&!(this._$Ej??(this._$Ej=new Map)).has(i)&&(this._$Ej.set(i,o??t??this[i]),n!==!0||o!==void 0)||(this._$AL.has(i)||(this.hasUpdated||r||(t=void 0),this._$AL.set(i,t)),a===!0&&this._$Em!==i&&(this._$Eq??(this._$Eq=new Set)).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[a,n]of this._$Ep)this[a]=n;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[a,n]of r){let{wrapped:o}=n,s=this[a];o!==!0||this._$AL.has(a)||s===void 0||this.C(a,void 0,n,s)}}let i=!1,t=this._$AL;try{i=this.shouldUpdate(t),i?(this.willUpdate(t),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(t)):this._$EM()}catch(r){throw i=!1,this._$EM(),r}i&&this._$AE(t)}willUpdate(i){}_$AE(i){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(i){}firstUpdated(i){}};M.elementStyles=[],M.shadowRootOptions={mode:"open"},M[Se("elementProperties")]=new Map,M[Se("finalized")]=new Map,na?.({ReactiveElement:M}),(Z.reactiveElementVersions??(Z.reactiveElementVersions=[])).push("2.1.2");var Ce=globalThis,yi=e=>e,We=Ce.trustedTypes,bi=We?We.createPolicy("lit-html",{createHTML:e=>e}):void 0,It="$lit$",U=`lit$${Math.random().toFixed(9).slice(2)}$`,Rt="?"+U,oa=`<${Rt}>`,le=document,De=()=>le.createComment(""),ze=e=>e===null||typeof e!="object"&&typeof e!="function",Lt=Array.isArray,Si=e=>Lt(e)||typeof e?.[Symbol.iterator]=="function",zt=`[ 	
\f\r]`,$e=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xi=/-->/g,wi=/>/g,oe=RegExp(`>|${zt}(?:([^\\s"'>=/]+)(${zt}*=${zt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ki=/'/g,Ti=/"/g,Ai=/^(?:script|style|textarea|title)$/i,Nt=e=>(i,...t)=>({_$litType$:e,strings:i,values:t}),d=Nt(1),$i=Nt(2),ko=Nt(3),G=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Ei=new WeakMap,se=le.createTreeWalker(le,129);function Ci(e,i){if(!Lt(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return bi!==void 0?bi.createHTML(i):i}var Di=(e,i)=>{let t=e.length-1,r=[],a,n=i===2?"<svg>":i===3?"<math>":"",o=$e;for(let s=0;s<t;s++){let c=e[s],u,g,m=-1,f=0;for(;f<c.length&&(o.lastIndex=f,g=o.exec(c),g!==null);)f=o.lastIndex,o===$e?g[1]==="!--"?o=xi:g[1]!==void 0?o=wi:g[2]!==void 0?(Ai.test(g[2])&&(a=RegExp("</"+g[2],"g")),o=oe):g[3]!==void 0&&(o=oe):o===oe?g[0]===">"?(o=a??$e,m=-1):g[1]===void 0?m=-2:(m=o.lastIndex-g[2].length,u=g[1],o=g[3]===void 0?oe:g[3]==='"'?Ti:ki):o===Ti||o===ki?o=oe:o===xi||o===wi?o=$e:(o=oe,a=void 0);let v=o===oe&&e[s+1].startsWith("/>")?" ":"";n+=o===$e?c+oa:m>=0?(r.push(u),c.slice(0,m)+It+c.slice(m)+U+v):c+U+(m===-2?s:v)}return[Ci(e,n+(e[t]||"<?>")+(i===2?"</svg>":i===3?"</math>":"")),r]},Ie=class e{constructor({strings:i,_$litType$:t},r){let a;this.parts=[];let n=0,o=0,s=i.length-1,c=this.parts,[u,g]=Di(i,t);if(this.el=e.createElement(u,r),se.currentNode=this.el.content,t===2||t===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(a=se.nextNode())!==null&&c.length<s;){if(a.nodeType===1){if(a.hasAttributes())for(let m of a.getAttributeNames())if(m.endsWith(It)){let f=g[o++],v=a.getAttribute(m).split(U),y=/([.?@])?(.*)/.exec(f);c.push({type:1,index:n,name:y[2],strings:v,ctor:y[1]==="."?Xe:y[1]==="?"?Ye:y[1]==="@"?Je:de}),a.removeAttribute(m)}else m.startsWith(U)&&(c.push({type:6,index:n}),a.removeAttribute(m));if(Ai.test(a.tagName)){let m=a.textContent.split(U),f=m.length-1;if(f>0){a.textContent=We?We.emptyScript:"";for(let v=0;v<f;v++)a.append(m[v],De()),se.nextNode(),c.push({type:2,index:++n});a.append(m[f],De())}}}else if(a.nodeType===8)if(a.data===Rt)c.push({type:2,index:n});else{let m=-1;for(;(m=a.data.indexOf(U,m+1))!==-1;)c.push({type:7,index:n}),m+=U.length-1}n++}}static createElement(i,t){let r=le.createElement("template");return r.innerHTML=i,r}};function ce(e,i,t=e,r){if(i===G)return i;let a=r!==void 0?t._$Co?.[r]:t._$Cl,n=ze(i)?void 0:i._$litDirective$;return a?.constructor!==n&&(a?._$AO?.(!1),n===void 0?a=void 0:(a=new n(e),a._$AT(e,t,r)),r!==void 0?(t._$Co??(t._$Co=[]))[r]=a:t._$Cl=a),a!==void 0&&(i=ce(e,a._$AS(e,i.values),a,r)),i}var Ze=class{constructor(i,t){this._$AV=[],this._$AN=void 0,this._$AD=i,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(i){let{el:{content:t},parts:r}=this._$AD,a=(i?.creationScope??le).importNode(t,!0);se.currentNode=a;let n=se.nextNode(),o=0,s=0,c=r[0];for(;c!==void 0;){if(o===c.index){let u;c.type===2?u=new ve(n,n.nextSibling,this,i):c.type===1?u=new c.ctor(n,c.name,c.strings,this,i):c.type===6&&(u=new Ke(n,this,i)),this._$AV.push(u),c=r[++s]}o!==c?.index&&(n=se.nextNode(),o++)}return se.currentNode=le,a}p(i){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(i,r,t),t+=r.strings.length-2):r._$AI(i[t])),t++}},ve=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(i,t,r,a){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=i,this._$AB=t,this._$AM=r,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let i=this._$AA.parentNode,t=this._$AM;return t!==void 0&&i?.nodeType===11&&(i=t.parentNode),i}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(i,t=this){i=ce(this,i,t),ze(i)?i===_||i==null||i===""?(this._$AH!==_&&this._$AR(),this._$AH=_):i!==this._$AH&&i!==G&&this._(i):i._$litType$!==void 0?this.$(i):i.nodeType!==void 0?this.T(i):Si(i)?this.k(i):this._(i)}O(i){return this._$AA.parentNode.insertBefore(i,this._$AB)}T(i){this._$AH!==i&&(this._$AR(),this._$AH=this.O(i))}_(i){this._$AH!==_&&ze(this._$AH)?this._$AA.nextSibling.data=i:this.T(le.createTextNode(i)),this._$AH=i}$(i){let{values:t,_$litType$:r}=i,a=typeof r=="number"?this._$AC(i):(r.el===void 0&&(r.el=Ie.createElement(Ci(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===a)this._$AH.p(t);else{let n=new Ze(a,this),o=n.u(this.options);n.p(t),this.T(o),this._$AH=n}}_$AC(i){let t=Ei.get(i.strings);return t===void 0&&Ei.set(i.strings,t=new Ie(i)),t}k(i){Lt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,a=0;for(let n of i)a===t.length?t.push(r=new e(this.O(De()),this.O(De()),this,this.options)):r=t[a],r._$AI(n),a++;a<t.length&&(this._$AR(r&&r._$AB.nextSibling,a),t.length=a)}_$AR(i=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);i!==this._$AB;){let r=yi(i).nextSibling;yi(i).remove(),i=r}}setConnected(i){this._$AM===void 0&&(this._$Cv=i,this._$AP?.(i))}},de=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(i,t,r,a,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=i,this.name=t,this._$AM=a,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=_}_$AI(i,t=this,r,a){let n=this.strings,o=!1;if(n===void 0)i=ce(this,i,t,0),o=!ze(i)||i!==this._$AH&&i!==G,o&&(this._$AH=i);else{let s=i,c,u;for(i=n[0],c=0;c<n.length-1;c++)u=ce(this,s[r+c],t,c),u===G&&(u=this._$AH[c]),o||(o=!ze(u)||u!==this._$AH[c]),u===_?i=_:i!==_&&(i+=(u??"")+n[c+1]),this._$AH[c]=u}o&&!a&&this.j(i)}j(i){i===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,i??"")}},Xe=class extends de{constructor(){super(...arguments),this.type=3}j(i){this.element[this.name]=i===_?void 0:i}},Ye=class extends de{constructor(){super(...arguments),this.type=4}j(i){this.element.toggleAttribute(this.name,!!i&&i!==_)}},Je=class extends de{constructor(i,t,r,a,n){super(i,t,r,a,n),this.type=5}_$AI(i,t=this){if((i=ce(this,i,t,0)??_)===G)return;let r=this._$AH,a=i===_&&r!==_||i.capture!==r.capture||i.once!==r.once||i.passive!==r.passive,n=i!==_&&(r===_||a);a&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,i),this._$AH=i}handleEvent(i){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,i):this._$AH.handleEvent(i)}},Ke=class{constructor(i,t,r){this.element=i,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(i){ce(this,i)}},zi={M:It,P:U,A:Rt,C:1,L:Di,R:Ze,D:Si,V:ce,I:ve,H:de,N:Ye,U:Je,B:Xe,F:Ke},sa=Ce.litHtmlPolyfillSupport;sa?.(Ie,ve),(Ce.litHtmlVersions??(Ce.litHtmlVersions=[])).push("3.3.3");var Ii=(e,i,t)=>{let r=t?.renderBefore??i,a=r._$litPart$;if(a===void 0){let n=t?.renderBefore??null;r._$litPart$=a=new ve(i.insertBefore(De(),n),n,void 0,t??{})}return a._$AI(e),a};var Re=globalThis,A=class extends M{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;let i=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=i.firstChild),i}update(i){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=Ii(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}};A._$litElement$=!0,A.finalized=!0,Re.litElementHydrateSupport?.({LitElement:A});var la=Re.litElementPolyfillSupport;la?.({LitElement:A});(Re.litElementVersions??(Re.litElementVersions=[])).push("4.2.2");var ca={attribute:!0,type:String,converter:Ae,reflect:!1,hasChanged:qe},da=(e=ca,i,t)=>{let{kind:r,metadata:a}=t,n=globalThis.litPropertyMetadata.get(a);if(n===void 0&&globalThis.litPropertyMetadata.set(a,n=new Map),r==="setter"&&((e=Object.create(e)).wrapped=!0),n.set(t.name,e),r==="accessor"){let{name:o}=t;return{set(s){let c=i.get.call(this);i.set.call(this,s),this.requestUpdate(o,c,e,!0,s)},init(s){return s!==void 0&&this.C(o,void 0,e,s),s}}}if(r==="setter"){let{name:o}=t;return function(s){let c=this[o];i.call(this,s),this.requestUpdate(o,c,e,!0,s)}}throw Error("Unsupported decorator location: "+r)};function x(e){return(i,t)=>typeof t=="object"?da(e,i,t):((r,a,n)=>{let o=a.hasOwnProperty(n);return a.constructor.createProperty(n,r),o?Object.getOwnPropertyDescriptor(a,n):void 0})(e,i,t)}function b(e){return x({...e,state:!0,attribute:!1})}var ue=(e,i,t)=>(t.configurable=!0,t.enumerable=!0,Reflect.decorate&&typeof i!="object"&&Object.defineProperty(e,i,t),t);function R(e,i){return(t,r,a)=>{let n=o=>o.renderRoot?.querySelector(e)??null;if(i){let{get:o,set:s}=typeof r=="object"?t:a??(()=>{let c=Symbol();return{get(){return this[c]},set(u){this[c]=u}}})();return ue(t,r,{get(){let c=o.call(this);return c===void 0&&(c=n(this),(c!==null||this.hasUpdated)&&s.call(this,c)),c}})}return ue(t,r,{get(){return n(this)}})}}var Pt={};W(Pt,{card:()=>ga,common:()=>ua,default:()=>va,intervals:()=>pa,notifications:()=>ma,panel:()=>fa,templates:()=>_a,trigger_types:()=>ha});var ua={loading:"Loading...",none:"None",no_tasks:"No tasks found.",ungrouped:"Ungrouped",cancel:"Cancel",invalid_date:"Invalid date entered."},pa={day:"Day",days:"Days",week:"Week",weeks:"Weeks",month:"Month",months:"Months",year:"Year",years:"Years",every_uses:"Every {value} uses",every_runtime:"Every {value} runtime"},ha={time:"Time-based",date:"Fixed date",count:"Count-based",runtime:"Runtime-based"},ma={when:{due:"Due",overdue:"Overdue",due_and_overdue:"Due and overdue"}},ga={add_task:{added:'"{title}" added.',admin_only:"Only administrators can add tasks."}},fa={cards:{new:{title:"Create New Task",fields:{title:{heading:"Task Title"},interval_value:{heading:"Interval"},interval_type:{heading:"Interval Type"},last_performed:{heading:"Last Performed",helper:"Leave blank to use today"},anchor_date:{heading:"Anchor date",helper:"The schedule repeats from this fixed date"},tag:{heading:"Tag"},icon:{heading:"Icon"},label:{heading:"Label(s)"},area:{heading:"Area"},description:{heading:"Description"},trigger_type:{heading:"Trigger type"},count_entity_id:{heading:"Counted entity"},count_threshold:{heading:"Count threshold"},runtime_entity_id:{heading:"Runtime sensor"},runtime_threshold:{heading:"Runtime threshold"},group_id:{heading:"Group",helper:"Pick a group or type a new name"},notifications_enabled:{heading:"Enable notifications"},notification_target:{heading:"Notify service",helper:"Leave empty to use notify.notify"},notify_when:{heading:"Notify when"},notify_days_before_due:{heading:"Days before due",helper:"Optional due-soon reminder offset"},notification_time:{heading:"Time of day",helper:"When automatic notifications are sent"},notification_url:{heading:"Open URL",helper:"Optional URL for the notification's Open action"},active_months:{heading:"Active months",helper:"Seasonal tasks are only due in these months (empty = year-round)"}},sections:{optional:"Optional settings",notifications:"Notifications"},actions:{add_task:"Add Task"},alerts:{required:"Please fill all fields",error:"Error adding task. See console for details."}},current:{next:"Next Due",actions:{edit:"Edit",move:"Move to group",remove:"Remove"},alerts:{complete_success:'"{title}" marked complete. The next due date was recalculated.',complete_error:"Failed to mark task complete. See console for details.",remove_error:"Failed to remove the task. See console for details."},filter:{search:"Search tasks...",templates:"Browse templates",export:"Export CSV",clear:"Clear filters"}},groups:{title:"Groups",fields:{new_group:{heading:"New group"}},actions:{create:"Create",rename:"Rename",delete:"Delete",save:"Save"},empty:"No groups yet. Create one to organize your tasks.",confirm_delete:'Delete group "{title}"? Its tasks move to Ungrouped.',alerts:{error:"Failed to create the group. Check the browser console and Home Assistant logs.",exists:'Group "{title}" already exists.',rename_error:"Failed to rename the group. See console for details.",delete_error:"Failed to delete the group. See console for details."},confirm_delete_title:"Delete Group"}},dialog:{edit_task:{title:"Edit Task",fields:{interval_value:{heading:"Interval"},interval_type:{heading:"Interval Type"},last_performed:{heading:"Last Performed",helper:"Leave blank to use today"},anchor_date:{heading:"Anchor date",helper:"The schedule repeats from this fixed date"},tag:{heading:"Tag"},icon:{heading:"Icon"},label:{heading:"Label(s)"},area:{heading:"Area"},trigger_type:{heading:"Trigger type"},count_entity_id:{heading:"Counted entity"},count_threshold:{heading:"Count threshold"},runtime_entity_id:{heading:"Runtime sensor"},runtime_threshold:{heading:"Runtime threshold"},title:{heading:"Title"},description:{heading:"Description"},group_id:{heading:"Group",helper:"Pick a group or type a new name"},notifications_enabled:{heading:"Enable notifications"},notification_target:{heading:"Notify service",helper:"Leave empty to use notify.notify"},notify_when:{heading:"Notify when"},notify_days_before_due:{heading:"Days before due",helper:"Optional due-soon reminder offset"},notification_time:{heading:"Time of day",helper:"When automatic notifications are sent"},notification_url:{heading:"Open URL",helper:"Optional URL for the notification's Open action"},active_months:{heading:"Active months",helper:"Seasonal tasks are only due in these months (empty = year-round)"}},sections:{optional:"Optional settings",notifications:"Notifications",history:"History"},actions:{cancel:"Cancel",save:"Save",test_notification:"Send test notification"},alerts:{error:"Failed to save changes. See console for details.",test_error:"Failed to send the test notification. See console for details."}},move_task:{title:"Move task",fields:{group_id:{heading:"Group"}},actions:{cancel:"Cancel",move:"Move"}},confirm_complete:{title:"Mark Task Complete",message:'Mark "{title}" as complete? Last performed will be reset to today and the next due date will be recalculated based on the {interval} interval.',message_progress:'Mark "{title}" as complete? Progress ({interval}) will start over.',note_label:"Note (optional)",actions:{confirm:"Mark Complete"}},confirm_remove:{title:"Remove Task",message:'Remove "{title}"? This cannot be undone.',actions:{confirm:"Remove"}},templates:{title:"Task Templates",search:"Search templates...",import_csv:"Import from CSV",choose_csv:"Choose CSV file",csv_hint:"Columns: title (required), description, interval_value, interval_type, last_performed (YYYY-MM-DD), icon, group_id",csv_empty:"No importable rows found in the file.",no_matches:"No templates match your search.",import_count:"{count, plural, one {Import 1 task} other {Import # tasks}}",imported:"{count, plural, one {1 task imported.} other {# tasks imported.}}",import_failed:"Failed to import: {titles}",preview:{title:"Title",interval:"Interval",last_performed:"Last performed",group:"Group"}}},toolbar:{add_task:"Add task",manage_groups:"Manage groups"},nav:{all_tasks:"All tasks",done_editing:"Done"},list:{due_today:"Due today",days_overdue:"{count, plural, one {1 day overdue} other {# days overdue}}",days_left:"{count, plural, one {Due in 1 day} other {# days left}}",search:"Search tasks...",all_groups:"All groups",overdue:"Overdue",due_soon:"Due soon",upcoming:"Upcoming",no_tasks:"No tasks found",done:"Done",last_performed:"Last Performed",progress:"Progress",history:"History",complete:"Complete",remove:"Remove",all_caught_up:"All caught up",needs_attention:"{count, plural, one {1 task needs attention} other {# tasks need attention}}",done_today:"Done today",repeats:"Repeats",next_due:"Next due {date}",clear_search:"Clear search",group_by:"Group by",by_status:"Status"},empty:{title:"No tasks yet",message:"Add your first task, or start from the template library of common household tasks.",message_readonly:"Tasks added by an administrator will show up here."}},_a={categories:{hvac:"HVAC",plumbing:"Plumbing",electrical:"Electrical",appliances:"Appliances",interior:"Interior",exterior:"Exterior",yard:"Yard & garden",safety:"Safety",vehicles:"Vehicles"}},va={common:ua,intervals:pa,trigger_types:ha,notifications:ma,card:ga,panel:fa,templates:_a};var Bt={};W(Bt,{card:()=>ka,common:()=>ya,default:()=>Sa,intervals:()=>ba,notifications:()=>wa,panel:()=>Ta,templates:()=>Ea,trigger_types:()=>xa});var ya={loading:"Wird geladen...",none:"Keine",no_tasks:"Keine Aufgaben gefunden.",ungrouped:"Ohne Gruppe",cancel:"Abbrechen",invalid_date:"Ung\xFCltiges Datum eingegeben."},ba={day:"Tag",days:"Tage",week:"Woche",weeks:"Wochen",month:"Monat",months:"Monate",year:"Jahr",years:"Jahre",every_uses:"Alle {value} Nutzungen",every_runtime:"Alle {value} Laufzeit"},xa={time:"Zeitbasiert",date:"Festes Datum",count:"Z\xE4hlerbasiert",runtime:"Laufzeitbasiert"},wa={when:{due:"F\xE4llig",overdue:"\xDCberf\xE4llig",due_and_overdue:"F\xE4llig und \xFCberf\xE4llig"}},ka={add_task:{added:'"{title}" wurde hinzugef\xFCgt.',admin_only:"Nur Administratoren k\xF6nnen Aufgaben hinzuf\xFCgen."}},Ta={cards:{new:{title:"Neue Aufgabe erstellen",fields:{title:{heading:"Aufgabentitel"},interval_value:{heading:"Intervall"},interval_type:{heading:"Intervalltyp"},last_performed:{heading:"Zuletzt durchgef\xFChrt",helper:"Leer lassen, um heutiges Datum zu verwenden"},anchor_date:{heading:"Ankerdatum",helper:"Der Zeitplan wiederholt sich ab diesem festen Datum"},tag:{heading:"Tag"},icon:{heading:"Symbol"},label:{heading:"Bezeichnung(en)"},area:{heading:"Bereich"},trigger_type:{heading:"Ausl\xF6ser-Typ"},count_entity_id:{heading:"Gez\xE4hlte Entit\xE4t"},count_threshold:{heading:"Z\xE4hl-Schwellwert"},runtime_entity_id:{heading:"Laufzeit-Sensor"},runtime_threshold:{heading:"Laufzeit-Schwellwert"},description:{heading:"Beschreibung"},group_id:{heading:"Gruppe",helper:"Gruppe w\xE4hlen oder neuen Namen eingeben"},notifications_enabled:{heading:"Benachrichtigungen aktivieren"},notification_target:{heading:"Benachrichtigungsdienst",helper:"Leer lassen, um notify.notify zu verwenden"},notify_when:{heading:"Benachrichtigen bei"},notify_days_before_due:{heading:"Tage vor F\xE4lligkeit",helper:"Optionale Vorab-Erinnerung"},notification_time:{heading:"Uhrzeit",helper:"Wann automatische Benachrichtigungen gesendet werden"},notification_url:{heading:"URL \xF6ffnen",helper:"Optionale URL f\xFCr die Aktion \u201E\xD6ffnen\u201C der Benachrichtigung"},active_months:{heading:"Aktive Monate",helper:"Saisonale Aufgaben sind nur in diesen Monaten f\xE4llig (leer = ganzj\xE4hrig)"}},sections:{optional:"Optionale Einstellungen",notifications:"Benachrichtigungen"},actions:{add_task:"Aufgabe hinzuf\xFCgen"},alerts:{required:"Bitte alle Felder ausf\xFCllen",error:"Fehler beim Hinzuf\xFCgen der Aufgabe. Siehe Konsole f\xFCr Details."}},current:{next:"N\xE4chste F\xE4lligkeit",actions:{edit:"Bearbeiten",move:"In Gruppe verschieben",remove:"Entfernen"},alerts:{complete_success:'"{title}" wurde als erledigt markiert. Das n\xE4chste F\xE4lligkeitsdatum wurde neu berechnet.',complete_error:"Aufgabe konnte nicht als erledigt markiert werden. Details siehe Konsole.",remove_error:"Aufgabe konnte nicht entfernt werden. Details in der Konsole."},filter:{search:"Aufgaben durchsuchen...",templates:"Vorlagen durchsuchen",export:"CSV exportieren",clear:"Filter zur\xFCcksetzen"}},groups:{title:"Gruppen",fields:{new_group:{heading:"Neue Gruppe"}},actions:{create:"Erstellen",rename:"Umbenennen",delete:"L\xF6schen",save:"Speichern"},empty:"Noch keine Gruppen. Erstellen Sie eine, um Aufgaben zu organisieren.",confirm_delete:'Gruppe "{title}" l\xF6schen? Ihre Aufgaben werden in "Ohne Gruppe" verschoben.',alerts:{error:"Gruppe konnte nicht erstellt werden. Pr\xFCfen Sie die Browserkonsole und die Home-Assistant-Protokolle.",exists:'Gruppe "{title}" existiert bereits.',rename_error:"Gruppe konnte nicht umbenannt werden. Details in der Konsole.",delete_error:"Gruppe konnte nicht gel\xF6scht werden. Details in der Konsole."},confirm_delete_title:"Gruppe l\xF6schen"}},dialog:{edit_task:{title:"Aufgabe bearbeiten",fields:{interval_value:{heading:"Intervall"},interval_type:{heading:"Intervalltyp"},last_performed:{heading:"Zuletzt durchgef\xFChrt",helper:"Leer lassen, um heutiges Datum zu verwenden"},anchor_date:{heading:"Ankerdatum",helper:"Der Zeitplan wiederholt sich ab diesem festen Datum"},tag:{heading:"Tag"},icon:{heading:"Symbol"},label:{heading:"Bezeichnung(en)"},area:{heading:"Bereich"},trigger_type:{heading:"Ausl\xF6ser-Typ"},count_entity_id:{heading:"Gez\xE4hlte Entit\xE4t"},count_threshold:{heading:"Z\xE4hl-Schwellwert"},runtime_entity_id:{heading:"Laufzeit-Sensor"},runtime_threshold:{heading:"Laufzeit-Schwellwert"},title:{heading:"Titel"},description:{heading:"Beschreibung"},group_id:{heading:"Gruppe",helper:"Gruppe w\xE4hlen oder neuen Namen eingeben"},notifications_enabled:{heading:"Benachrichtigungen aktivieren"},notification_target:{heading:"Benachrichtigungsdienst",helper:"Leer lassen, um notify.notify zu verwenden"},notify_when:{heading:"Benachrichtigen bei"},notify_days_before_due:{heading:"Tage vor F\xE4lligkeit",helper:"Optionale Vorab-Erinnerung"},notification_time:{heading:"Uhrzeit",helper:"Wann automatische Benachrichtigungen gesendet werden"},notification_url:{heading:"URL \xF6ffnen",helper:"Optionale URL f\xFCr die Aktion \u201E\xD6ffnen\u201C der Benachrichtigung"},active_months:{heading:"Aktive Monate",helper:"Saisonale Aufgaben sind nur in diesen Monaten f\xE4llig (leer = ganzj\xE4hrig)"}},sections:{optional:"Optionale Einstellungen",notifications:"Benachrichtigungen",history:"Verlauf"},actions:{cancel:"Abbrechen",save:"Speichern",test_notification:"Testbenachrichtigung senden"},alerts:{error:"\xC4nderungen konnten nicht gespeichert werden. Details in der Konsole.",test_error:"Testbenachrichtigung konnte nicht gesendet werden. Details in der Konsole."}},move_task:{title:"Aufgabe verschieben",fields:{group_id:{heading:"Gruppe"}},actions:{cancel:"Abbrechen",move:"Verschieben"}},confirm_complete:{title:"Aufgabe als erledigt markieren",message:'"{title}" als erledigt markieren? Zuletzt durchgef\xFChrt wird auf heute zur\xFCckgesetzt und das n\xE4chste F\xE4lligkeitsdatum wird basierend auf dem Intervall von {interval} neu berechnet.',message_progress:'"{title}" als erledigt markieren? Der Fortschritt ({interval}) beginnt von vorn.',note_label:"Notiz (optional)",actions:{confirm:"Als erledigt markieren"}},confirm_remove:{title:"Aufgabe entfernen",message:'"{title}" entfernen? Dies kann nicht r\xFCckg\xE4ngig gemacht werden.',actions:{confirm:"Entfernen"}},templates:{title:"Aufgabenvorlagen",search:"Vorlagen durchsuchen...",import_csv:"Aus CSV importieren",choose_csv:"CSV-Datei ausw\xE4hlen",csv_hint:"Spalten: title (erforderlich), description, interval_value, interval_type, last_performed (JJJJ-MM-TT), icon, group_id",csv_empty:"Keine importierbaren Zeilen in der Datei gefunden.",no_matches:"Keine Vorlagen entsprechen deiner Suche.",import_count:"{count, plural, one {1 Aufgabe importieren} other {# Aufgaben importieren}}",imported:"{count, plural, one {1 Aufgabe importiert.} other {# Aufgaben importiert.}}",import_failed:"Import fehlgeschlagen: {titles}",preview:{title:"Titel",interval:"Intervall",last_performed:"Zuletzt erledigt",group:"Gruppe"}}},toolbar:{add_task:"Aufgabe hinzuf\xFCgen",manage_groups:"Gruppen verwalten"},nav:{all_tasks:"Alle Aufgaben",done_editing:"Fertig"},list:{due_today:"Heute f\xE4llig",days_overdue:"{count, plural, one {1 Tag \xFCberf\xE4llig} other {# Tage \xFCberf\xE4llig}}",days_left:"{count, plural, one {F\xE4llig in 1 Tag} other {Noch # Tage}}",search:"Aufgaben suchen...",all_groups:"Alle Gruppen",overdue:"\xDCberf\xE4llig",due_soon:"Bald f\xE4llig",upcoming:"Anstehend",no_tasks:"Keine Aufgaben gefunden",done:"Erledigt",last_performed:"Zuletzt durchgef\xFChrt",progress:"Fortschritt",history:"Verlauf",complete:"Abschlie\xDFen",remove:"Entfernen",all_caught_up:"Alles erledigt",needs_attention:"{count, plural, one {1 Aufgabe braucht Aufmerksamkeit} other {# Aufgaben brauchen Aufmerksamkeit}}",done_today:"Heute erledigt",repeats:"Wiederholung",next_due:"Wieder f\xE4llig am {date}",clear_search:"Suche l\xF6schen",group_by:"Gruppieren nach",by_status:"Status"},empty:{title:"Noch keine Aufgaben",message:"F\xFCge deine erste Aufgabe hinzu oder starte mit der Vorlagenbibliothek f\xFCr typische Aufgaben im Haushalt.",message_readonly:"Aufgaben, die ein Administrator hinzuf\xFCgt, erscheinen hier."}},Ea={categories:{hvac:"Heizung & Klima",plumbing:"Sanit\xE4r",electrical:"Elektrik",appliances:"Haushaltsger\xE4te",interior:"Innenbereich",exterior:"Au\xDFenbereich",yard:"Garten",safety:"Sicherheit",vehicles:"Fahrzeuge"}},Sa={common:ya,intervals:ba,trigger_types:xa,notifications:wa,card:ka,panel:Ta,templates:Ea};var Ht={};W(Ht,{card:()=>za,common:()=>Aa,default:()=>La,intervals:()=>$a,notifications:()=>Da,panel:()=>Ia,templates:()=>Ra,trigger_types:()=>Ca});var Aa={loading:"Cargando...",none:"Ninguno",no_tasks:"No se encontraron tareas.",ungrouped:"Sin grupo",cancel:"Cancelar",invalid_date:"La fecha introducida no es v\xE1lida."},$a={day:"D\xEDa",days:"D\xEDas",week:"Semana",weeks:"Semanas",month:"Mes",months:"Meses",year:"A\xF1o",years:"A\xF1os",every_uses:"Cada {value} usos",every_runtime:"Cada {value} de funcionamiento"},Ca={time:"Basado en tiempo",date:"Fecha fija",count:"Basado en conteo",runtime:"Basado en tiempo de funcionamiento"},Da={when:{due:"Al vencer",overdue:"Con retraso",due_and_overdue:"Al vencer y con retraso"}},za={add_task:{added:'Se a\xF1adi\xF3 "{title}".',admin_only:"Solo los administradores pueden a\xF1adir tareas."}},Ia={cards:{new:{title:"Crear nueva tarea",fields:{title:{heading:"T\xEDtulo de la tarea"},interval_value:{heading:"Intervalo"},interval_type:{heading:"Tipo de intervalo"},last_performed:{heading:"\xDAltima realizaci\xF3n",helper:"Deja en blanco para usar hoy"},anchor_date:{heading:"Fecha de anclaje",helper:"La programaci\xF3n se repite a partir de esta fecha fija"},tag:{heading:"Tag"},icon:{heading:"Icono"},label:{heading:"Etiqueta(s)"},area:{heading:"\xC1rea"},description:{heading:"Descripci\xF3n"},trigger_type:{heading:"Tipo de disparador"},count_entity_id:{heading:"Entidad contada"},count_threshold:{heading:"Umbral de conteo"},runtime_entity_id:{heading:"Sensor de tiempo de funcionamiento"},runtime_threshold:{heading:"Umbral de tiempo de funcionamiento"},group_id:{heading:"Grupo",helper:"Elige un grupo o escribe un nombre nuevo"},notifications_enabled:{heading:"Activar notificaciones"},notification_target:{heading:"Servicio de notificaci\xF3n",helper:"Deja vac\xEDo para usar notify.notify"},notify_when:{heading:"Notificar cuando"},notify_days_before_due:{heading:"D\xEDas antes del vencimiento",helper:"Desfase opcional del recordatorio de vencimiento pr\xF3ximo"},notification_time:{heading:"Hora del d\xEDa",helper:"Cu\xE1ndo se env\xEDan las notificaciones autom\xE1ticas"},notification_url:{heading:"URL para abrir",helper:"URL opcional para la acci\xF3n Abrir de la notificaci\xF3n"},active_months:{heading:"Meses activos",helper:"Las tareas de temporada solo vencen en estos meses (vac\xEDo = todo el a\xF1o)"}},sections:{optional:"Ajustes opcionales",notifications:"Notificaciones"},actions:{add_task:"A\xF1adir tarea"},alerts:{required:"Completa todos los campos",error:"Error al a\xF1adir la tarea. Consulta la consola para m\xE1s detalles."}},current:{next:"Pr\xF3ximo vencimiento",actions:{edit:"Editar",move:"Mover a un grupo",remove:"Eliminar"},alerts:{complete_success:'"{title}" marcada como completada. Se recalcul\xF3 la pr\xF3xima fecha de vencimiento.',complete_error:"No se pudo marcar la tarea como completada. Consulta la consola para m\xE1s detalles.",remove_error:"No se pudo eliminar la tarea. Consulta la consola para m\xE1s detalles."},filter:{search:"Buscar tareas...",templates:"Explorar plantillas",export:"Exportar CSV",clear:"Borrar filtros"}},groups:{title:"Grupos",fields:{new_group:{heading:"Nuevo grupo"}},actions:{create:"Crear",rename:"Renombrar",delete:"Eliminar",save:"Guardar"},empty:"A\xFAn no hay grupos. Crea uno para organizar tus tareas.",confirm_delete:'\xBFEliminar el grupo "{title}"? Sus tareas se mover\xE1n a Sin grupo.',alerts:{error:"No se pudo crear el grupo. Revisa la consola del navegador y los registros de Home Assistant.",exists:'El grupo "{title}" ya existe.',rename_error:"No se pudo renombrar el grupo. Consulta la consola para m\xE1s detalles.",delete_error:"No se pudo eliminar el grupo. Consulta la consola para m\xE1s detalles."},confirm_delete_title:"Eliminar grupo"}},dialog:{edit_task:{title:"Editar tarea",fields:{interval_value:{heading:"Intervalo"},interval_type:{heading:"Tipo de intervalo"},last_performed:{heading:"\xDAltima realizaci\xF3n",helper:"Deja en blanco para usar hoy"},anchor_date:{heading:"Fecha de anclaje",helper:"La programaci\xF3n se repite a partir de esta fecha fija"},tag:{heading:"Tag"},icon:{heading:"Icono"},label:{heading:"Etiqueta(s)"},area:{heading:"\xC1rea"},trigger_type:{heading:"Tipo de disparador"},count_entity_id:{heading:"Entidad contada"},count_threshold:{heading:"Umbral de conteo"},runtime_entity_id:{heading:"Sensor de tiempo de funcionamiento"},runtime_threshold:{heading:"Umbral de tiempo de funcionamiento"},title:{heading:"T\xEDtulo"},description:{heading:"Descripci\xF3n"},group_id:{heading:"Grupo",helper:"Elige un grupo o escribe un nombre nuevo"},notifications_enabled:{heading:"Activar notificaciones"},notification_target:{heading:"Servicio de notificaci\xF3n",helper:"Deja vac\xEDo para usar notify.notify"},notify_when:{heading:"Notificar cuando"},notify_days_before_due:{heading:"D\xEDas antes del vencimiento",helper:"Desfase opcional del recordatorio de vencimiento pr\xF3ximo"},notification_time:{heading:"Hora del d\xEDa",helper:"Cu\xE1ndo se env\xEDan las notificaciones autom\xE1ticas"},notification_url:{heading:"URL para abrir",helper:"URL opcional para la acci\xF3n Abrir de la notificaci\xF3n"},active_months:{heading:"Meses activos",helper:"Las tareas de temporada solo vencen en estos meses (vac\xEDo = todo el a\xF1o)"}},sections:{optional:"Ajustes opcionales",notifications:"Notificaciones",history:"Historial"},actions:{cancel:"Cancelar",save:"Guardar",test_notification:"Enviar notificaci\xF3n de prueba"},alerts:{error:"No se pudieron guardar los cambios. Consulta la consola para m\xE1s detalles.",test_error:"No se pudo enviar la notificaci\xF3n de prueba. Consulta la consola para m\xE1s detalles."}},move_task:{title:"Mover tarea",fields:{group_id:{heading:"Grupo"}},actions:{cancel:"Cancelar",move:"Mover"}},confirm_complete:{title:"Marcar tarea como completada",message:'\xBFMarcar "{title}" como completada? La \xFAltima realizaci\xF3n se restablecer\xE1 a hoy y la pr\xF3xima fecha de vencimiento se recalcular\xE1 seg\xFAn el intervalo de {interval}.',message_progress:'\xBFMarcar "{title}" como completada? El progreso ({interval}) comenzar\xE1 de nuevo.',note_label:"Nota (opcional)",actions:{confirm:"Marcar como completada"}},confirm_remove:{title:"Eliminar tarea",message:'\xBFEliminar "{title}"? Esta acci\xF3n no se puede deshacer.',actions:{confirm:"Eliminar"}},templates:{title:"Plantillas de tareas",search:"Buscar plantillas...",import_csv:"Importar desde CSV",choose_csv:"Elegir archivo CSV",csv_hint:"Columnas: title (obligatoria), description, interval_value, interval_type, last_performed (AAAA-MM-DD), icon, group_id",csv_empty:"No se encontraron filas importables en el archivo.",no_matches:"Ninguna plantilla coincide con tu b\xFAsqueda.",import_count:"{count, plural, one {Importar 1 tarea} other {Importar # tareas}}",imported:"{count, plural, one {1 tarea importada.} other {# tareas importadas.}}",import_failed:"Error al importar: {titles}",preview:{title:"T\xEDtulo",interval:"Intervalo",last_performed:"\xDAltima realizaci\xF3n",group:"Grupo"}}},toolbar:{add_task:"A\xF1adir tarea",manage_groups:"Gestionar grupos"},nav:{all_tasks:"Todas las tareas",done_editing:"Listo"},list:{due_today:"Vence hoy",days_overdue:"{count, plural, one {1 d\xEDa de retraso} other {# d\xEDas de retraso}}",days_left:"{count, plural, one {Vence en 1 d\xEDa} other {Quedan # d\xEDas}}",search:"Buscar tareas...",all_groups:"Todos los grupos",overdue:"Atrasadas",due_soon:"Vencen pronto",upcoming:"Pr\xF3ximas",no_tasks:"No se encontraron tareas",done:"Hecho",last_performed:"\xDAltima realizaci\xF3n",progress:"Progreso",history:"Historial",complete:"Completar",remove:"Eliminar",all_caught_up:"Todo al d\xEDa",needs_attention:"{count, plural, one {1 tarea requiere atenci\xF3n} other {# tareas requieren atenci\xF3n}}",done_today:"Hecho hoy",repeats:"Se repite",next_due:"Pr\xF3ximo vencimiento: {date}",clear_search:"Borrar b\xFAsqueda",group_by:"Agrupar por",by_status:"Estado"},empty:{title:"A\xFAn no hay tareas",message:"A\xF1ade tu primera tarea o empieza con la biblioteca de plantillas de tareas dom\xE9sticas habituales.",message_readonly:"Las tareas que a\xF1ada un administrador aparecer\xE1n aqu\xED."}},Ra={categories:{hvac:"Climatizaci\xF3n",plumbing:"Fontaner\xEDa",electrical:"Electricidad",appliances:"Electrodom\xE9sticos",interior:"Interior",exterior:"Exterior",yard:"Jard\xEDn",safety:"Seguridad",vehicles:"Veh\xEDculos"}},La={common:Aa,intervals:$a,trigger_types:Ca,notifications:Da,card:za,panel:Ia,templates:Ra};var Ot={};W(Ot,{card:()=>Oa,common:()=>Na,default:()=>Ua,intervals:()=>Pa,notifications:()=>Ha,panel:()=>Fa,templates:()=>Ma,trigger_types:()=>Ba});var Na={loading:"Chargement...",none:"Aucun",no_tasks:"Aucune t\xE2che trouv\xE9e.",ungrouped:"Sans groupe",cancel:"Annuler",invalid_date:"Date saisie non valide."},Pa={day:"Jour",days:"Jours",week:"Semaine",weeks:"Semaines",month:"Mois",months:"Mois",year:"Ann\xE9e",years:"Ann\xE9es",every_uses:"Toutes les {value} utilisations",every_runtime:"Tous les {value} de fonctionnement"},Ba={time:"Bas\xE9 sur le temps",date:"Date fixe",count:"Bas\xE9 sur un compteur",runtime:"Bas\xE9 sur le fonctionnement"},Ha={when:{due:"\xC0 \xE9ch\xE9ance",overdue:"En retard",due_and_overdue:"\xC0 \xE9ch\xE9ance et en retard"}},Oa={add_task:{added:'"{title}" ajout\xE9e.',admin_only:"Seuls les administrateurs peuvent ajouter des t\xE2ches."}},Fa={cards:{new:{title:"Cr\xE9er une nouvelle t\xE2che",fields:{title:{heading:"Titre de la t\xE2che"},interval_value:{heading:"Intervalle"},interval_type:{heading:"Type d'intervalle"},last_performed:{heading:"Derni\xE8re ex\xE9cution",helper:"Laissez vide pour utiliser aujourd'hui"},anchor_date:{heading:"Date d'ancrage",helper:"Le planning se r\xE9p\xE8te \xE0 partir de cette date fixe"},tag:{heading:"Tag"},icon:{heading:"Ic\xF4ne"},label:{heading:"Libell\xE9(s)"},area:{heading:"Pi\xE8ce"},description:{heading:"Description"},trigger_type:{heading:"Type de d\xE9clencheur"},count_entity_id:{heading:"Entit\xE9 compt\xE9e"},count_threshold:{heading:"Seuil de comptage"},runtime_entity_id:{heading:"Capteur de fonctionnement"},runtime_threshold:{heading:"Seuil de fonctionnement"},group_id:{heading:"Groupe",helper:"Choisissez un groupe ou saisissez un nouveau nom"},notifications_enabled:{heading:"Activer les notifications"},notification_target:{heading:"Service de notification",helper:"Laissez vide pour utiliser notify.notify"},notify_when:{heading:"Notifier quand"},notify_days_before_due:{heading:"Jours avant l'\xE9ch\xE9ance",helper:"D\xE9calage facultatif du rappel d'\xE9ch\xE9ance proche"},notification_time:{heading:"Heure de la journ\xE9e",helper:"Heure d'envoi des notifications automatiques"},notification_url:{heading:"URL \xE0 ouvrir",helper:"URL facultative pour l'action Ouvrir de la notification"},active_months:{heading:"Mois actifs",helper:"Les t\xE2ches saisonni\xE8res ne sont dues que pendant ces mois (vide = toute l'ann\xE9e)"}},sections:{optional:"Param\xE8tres facultatifs",notifications:"Notifications"},actions:{add_task:"Ajouter la t\xE2che"},alerts:{required:"Veuillez remplir tous les champs",error:"Erreur lors de l'ajout de la t\xE2che. Consultez la console pour plus de d\xE9tails."}},current:{next:"Prochaine \xE9ch\xE9ance",actions:{edit:"Modifier",move:"D\xE9placer vers un groupe",remove:"Supprimer"},alerts:{complete_success:'"{title}" marqu\xE9e comme termin\xE9e. La prochaine \xE9ch\xE9ance a \xE9t\xE9 recalcul\xE9e.',complete_error:"Impossible de marquer la t\xE2che comme termin\xE9e. Consultez la console pour plus de d\xE9tails.",remove_error:"Impossible de supprimer la t\xE2che. Consultez la console pour plus de d\xE9tails."},filter:{search:"Rechercher des t\xE2ches...",templates:"Parcourir les mod\xE8les",export:"Exporter en CSV",clear:"Effacer les filtres"}},groups:{title:"Groupes",fields:{new_group:{heading:"Nouveau groupe"}},actions:{create:"Cr\xE9er",rename:"Renommer",delete:"Supprimer",save:"Enregistrer"},empty:"Aucun groupe pour le moment. Cr\xE9ez-en un pour organiser vos t\xE2ches.",confirm_delete:'Supprimer le groupe "{title}" ? Ses t\xE2ches seront d\xE9plac\xE9es vers Sans groupe.',alerts:{error:"Impossible de cr\xE9er le groupe. V\xE9rifiez la console du navigateur et les journaux de Home Assistant.",exists:'Le groupe "{title}" existe d\xE9j\xE0.',rename_error:"Impossible de renommer le groupe. Consultez la console pour plus de d\xE9tails.",delete_error:"Impossible de supprimer le groupe. Consultez la console pour plus de d\xE9tails."},confirm_delete_title:"Supprimer le groupe"}},dialog:{edit_task:{title:"Modifier la t\xE2che",fields:{interval_value:{heading:"Intervalle"},interval_type:{heading:"Type d'intervalle"},last_performed:{heading:"Derni\xE8re ex\xE9cution",helper:"Laissez vide pour utiliser aujourd'hui"},anchor_date:{heading:"Date d'ancrage",helper:"Le planning se r\xE9p\xE8te \xE0 partir de cette date fixe"},tag:{heading:"Tag"},icon:{heading:"Ic\xF4ne"},label:{heading:"Libell\xE9(s)"},area:{heading:"Pi\xE8ce"},trigger_type:{heading:"Type de d\xE9clencheur"},count_entity_id:{heading:"Entit\xE9 compt\xE9e"},count_threshold:{heading:"Seuil de comptage"},runtime_entity_id:{heading:"Capteur de fonctionnement"},runtime_threshold:{heading:"Seuil de fonctionnement"},title:{heading:"Titre"},description:{heading:"Description"},group_id:{heading:"Groupe",helper:"Choisissez un groupe ou saisissez un nouveau nom"},notifications_enabled:{heading:"Activer les notifications"},notification_target:{heading:"Service de notification",helper:"Laissez vide pour utiliser notify.notify"},notify_when:{heading:"Notifier quand"},notify_days_before_due:{heading:"Jours avant l'\xE9ch\xE9ance",helper:"D\xE9calage facultatif du rappel d'\xE9ch\xE9ance proche"},notification_time:{heading:"Heure de la journ\xE9e",helper:"Heure d'envoi des notifications automatiques"},notification_url:{heading:"URL \xE0 ouvrir",helper:"URL facultative pour l'action Ouvrir de la notification"},active_months:{heading:"Mois actifs",helper:"Les t\xE2ches saisonni\xE8res ne sont dues que pendant ces mois (vide = toute l'ann\xE9e)"}},sections:{optional:"Param\xE8tres facultatifs",notifications:"Notifications",history:"Historique"},actions:{cancel:"Annuler",save:"Enregistrer",test_notification:"Envoyer une notification de test"},alerts:{error:"Impossible d'enregistrer les modifications. Consultez la console pour plus de d\xE9tails.",test_error:"Impossible d'envoyer la notification de test. Consultez la console pour plus de d\xE9tails."}},move_task:{title:"D\xE9placer la t\xE2che",fields:{group_id:{heading:"Groupe"}},actions:{cancel:"Annuler",move:"D\xE9placer"}},confirm_complete:{title:"Marquer la t\xE2che comme termin\xE9e",message:`Marquer "{title}" comme termin\xE9e ? La derni\xE8re ex\xE9cution sera r\xE9initialis\xE9e \xE0 aujourd'hui et la prochaine \xE9ch\xE9ance sera recalcul\xE9e en fonction de l'intervalle {interval}.`,message_progress:'Marquer "{title}" comme termin\xE9e ? La progression ({interval}) repartira de z\xE9ro.',note_label:"Note (facultatif)",actions:{confirm:"Marquer comme termin\xE9e"}},confirm_remove:{title:"Supprimer la t\xE2che",message:'Supprimer "{title}" ? Cette action est irr\xE9versible.',actions:{confirm:"Supprimer"}},templates:{title:"Mod\xE8les de t\xE2ches",search:"Rechercher des mod\xE8les...",import_csv:"Importer depuis un CSV",choose_csv:"Choisir un fichier CSV",csv_hint:"Colonnes : title (obligatoire), description, interval_value, interval_type, last_performed (AAAA-MM-JJ), icon, group_id",csv_empty:"Aucune ligne importable trouv\xE9e dans le fichier.",no_matches:"Aucun mod\xE8le ne correspond \xE0 votre recherche.",import_count:"{count, plural, one {Importer 1 t\xE2che} other {Importer # t\xE2ches}}",imported:"{count, plural, one {1 t\xE2che import\xE9e.} other {# t\xE2ches import\xE9es.}}",import_failed:"\xC9chec de l'importation : {titles}",preview:{title:"Titre",interval:"Intervalle",last_performed:"Derni\xE8re ex\xE9cution",group:"Groupe"}}},toolbar:{add_task:"Ajouter une t\xE2che",manage_groups:"G\xE9rer les groupes"},nav:{all_tasks:"Toutes les t\xE2ches",done_editing:"Termin\xE9"},list:{due_today:"\xC9ch\xE9ance aujourd'hui",days_overdue:"{count, plural, one {1 jour de retard} other {# jours de retard}}",days_left:"{count, plural, one {\xC9ch\xE9ance dans 1 jour} other {# jours restants}}",search:"Rechercher des t\xE2ches...",all_groups:"Tous les groupes",overdue:"En retard",due_soon:"\xC9ch\xE9ance proche",upcoming:"\xC0 venir",no_tasks:"Aucune t\xE2che trouv\xE9e",done:"Termin\xE9",last_performed:"Derni\xE8re ex\xE9cution",progress:"Progression",history:"Historique",complete:"Terminer",remove:"Supprimer",all_caught_up:"Tout est \xE0 jour",needs_attention:"{count, plural, one {1 t\xE2che requiert votre attention} other {# t\xE2ches requi\xE8rent votre attention}}",done_today:"Fait aujourd'hui",repeats:"R\xE9p\xE9tition",next_due:"Prochaine \xE9ch\xE9ance : {date}",clear_search:"Effacer la recherche",group_by:"Regrouper par",by_status:"Statut"},empty:{title:"Aucune t\xE2che pour l'instant",message:"Ajoutez votre premi\xE8re t\xE2che ou partez de la biblioth\xE8que de mod\xE8les de t\xE2ches m\xE9nag\xE8res courantes.",message_readonly:"Les t\xE2ches ajout\xE9es par un administrateur appara\xEEtront ici."}},Ma={categories:{hvac:"CVC",plumbing:"Plomberie",electrical:"\xC9lectricit\xE9",appliances:"\xC9lectrom\xE9nager",interior:"Int\xE9rieur",exterior:"Ext\xE9rieur",yard:"Jardin",safety:"S\xE9curit\xE9",vehicles:"V\xE9hicules"}},Ua={common:Na,intervals:Pa,trigger_types:Ba,notifications:Ha,card:Oa,panel:Fa,templates:Ma};var Ft={};W(Ft,{card:()=>Wa,common:()=>Ga,default:()=>Ya,intervals:()=>ja,notifications:()=>qa,panel:()=>Za,templates:()=>Xa,trigger_types:()=>Va});var Ga={loading:"Caricamento...",none:"Nessuno",no_tasks:"Nessuna attivit\xE0 trovata.",ungrouped:"Senza gruppo",cancel:"Annulla",invalid_date:"Data inserita non valida."},ja={day:"Giorno",days:"Giorni",week:"Settimana",weeks:"Settimane",month:"Mese",months:"Mesi",year:"Anno",years:"Anni",every_uses:"Ogni {value} utilizzi",every_runtime:"Ogni {value} di funzionamento"},Va={time:"Basato sul tempo",date:"Data fissa",count:"Basato sul conteggio",runtime:"Basato sul tempo di funzionamento"},qa={when:{due:"In scadenza",overdue:"Scadute",due_and_overdue:"In scadenza e scadute"}},Wa={add_task:{added:'"{title}" aggiunta.',admin_only:"Solo gli amministratori possono aggiungere attivit\xE0."}},Za={cards:{new:{title:"Crea nuova attivit\xE0",fields:{title:{heading:"Titolo attivit\xE0"},interval_value:{heading:"Intervallo"},interval_type:{heading:"Tipo di intervallo"},last_performed:{heading:"Ultima esecuzione",helper:"Lascia vuoto per usare oggi"},anchor_date:{heading:"Data di riferimento",helper:"La pianificazione si ripete a partire da questa data fissa"},tag:{heading:"Tag"},icon:{heading:"Icona"},label:{heading:"Etichetta/e"},area:{heading:"Area"},description:{heading:"Descrizione"},trigger_type:{heading:"Tipo di attivazione"},count_entity_id:{heading:"Entit\xE0 conteggiata"},count_threshold:{heading:"Soglia di conteggio"},runtime_entity_id:{heading:"Sensore tempo di funzionamento"},runtime_threshold:{heading:"Soglia tempo di funzionamento"},group_id:{heading:"Gruppo",helper:"Scegli un gruppo o digita un nuovo nome"},notifications_enabled:{heading:"Abilita notifiche"},notification_target:{heading:"Servizio di notifica",helper:"Lascia vuoto per usare notify.notify"},notify_when:{heading:"Notifica quando"},notify_days_before_due:{heading:"Giorni prima della scadenza",helper:"Anticipo facoltativo per il promemoria di scadenza imminente"},notification_time:{heading:"Ora del giorno",helper:"Quando vengono inviate le notifiche automatiche"},notification_url:{heading:"URL da aprire",helper:"URL facoltativo per l'azione Apri della notifica"},active_months:{heading:"Mesi attivi",helper:"Le attivit\xE0 stagionali scadono solo in questi mesi (vuoto = tutto l'anno)"}},sections:{optional:"Impostazioni facoltative",notifications:"Notifiche"},actions:{add_task:"Aggiungi attivit\xE0"},alerts:{required:"Compila tutti i campi",error:"Errore durante l'aggiunta dell'attivit\xE0. Vedi la console per i dettagli."}},current:{next:"Prossima scadenza",actions:{edit:"Modifica",move:"Sposta nel gruppo",remove:"Rimuovi"},alerts:{complete_success:'"{title}" contrassegnata come completata. La prossima scadenza \xE8 stata ricalcolata.',complete_error:"Impossibile contrassegnare l'attivit\xE0 come completata. Vedi la console per i dettagli.",remove_error:"Impossibile rimuovere l'attivit\xE0. Vedi la console per i dettagli."},filter:{search:"Cerca attivit\xE0...",templates:"Sfoglia modelli",export:"Esporta CSV",clear:"Cancella filtri"}},groups:{title:"Gruppi",fields:{new_group:{heading:"Nuovo gruppo"}},actions:{create:"Crea",rename:"Rinomina",delete:"Elimina",save:"Salva"},empty:"Nessun gruppo ancora. Creane uno per organizzare le tue attivit\xE0.",confirm_delete:'Eliminare il gruppo "{title}"? Le sue attivit\xE0 passeranno a Senza gruppo.',alerts:{error:"Impossibile creare il gruppo. Controlla la console del browser e i log di Home Assistant.",exists:'Il gruppo "{title}" esiste gi\xE0.',rename_error:"Impossibile rinominare il gruppo. Vedi la console per i dettagli.",delete_error:"Impossibile eliminare il gruppo. Vedi la console per i dettagli."},confirm_delete_title:"Elimina gruppo"}},dialog:{edit_task:{title:"Modifica attivit\xE0",fields:{interval_value:{heading:"Intervallo"},interval_type:{heading:"Tipo di intervallo"},last_performed:{heading:"Ultima esecuzione",helper:"Lascia vuoto per usare oggi"},anchor_date:{heading:"Data di riferimento",helper:"La pianificazione si ripete a partire da questa data fissa"},tag:{heading:"Tag"},icon:{heading:"Icona"},label:{heading:"Etichetta/e"},area:{heading:"Area"},trigger_type:{heading:"Tipo di attivazione"},count_entity_id:{heading:"Entit\xE0 conteggiata"},count_threshold:{heading:"Soglia di conteggio"},runtime_entity_id:{heading:"Sensore tempo di funzionamento"},runtime_threshold:{heading:"Soglia tempo di funzionamento"},title:{heading:"Titolo"},description:{heading:"Descrizione"},group_id:{heading:"Gruppo",helper:"Scegli un gruppo o digita un nuovo nome"},notifications_enabled:{heading:"Abilita notifiche"},notification_target:{heading:"Servizio di notifica",helper:"Lascia vuoto per usare notify.notify"},notify_when:{heading:"Notifica quando"},notify_days_before_due:{heading:"Giorni prima della scadenza",helper:"Anticipo facoltativo per il promemoria di scadenza imminente"},notification_time:{heading:"Ora del giorno",helper:"Quando vengono inviate le notifiche automatiche"},notification_url:{heading:"URL da aprire",helper:"URL facoltativo per l'azione Apri della notifica"},active_months:{heading:"Mesi attivi",helper:"Le attivit\xE0 stagionali scadono solo in questi mesi (vuoto = tutto l'anno)"}},sections:{optional:"Impostazioni facoltative",notifications:"Notifiche",history:"Cronologia"},actions:{cancel:"Annulla",save:"Salva",test_notification:"Invia notifica di prova"},alerts:{error:"Impossibile salvare le modifiche. Vedi la console per i dettagli.",test_error:"Impossibile inviare la notifica di prova. Vedi la console per i dettagli."}},move_task:{title:"Sposta attivit\xE0",fields:{group_id:{heading:"Gruppo"}},actions:{cancel:"Annulla",move:"Sposta"}},confirm_complete:{title:"Contrassegna attivit\xE0 come completata",message:`Contrassegnare "{title}" come completata? L'ultima esecuzione sar\xE0 reimpostata a oggi e la prossima scadenza sar\xE0 ricalcolata in base all'intervallo {interval}.`,message_progress:`Contrassegnare "{title}" come completata? L'avanzamento ({interval}) ripartir\xE0 da zero.`,note_label:"Nota (facoltativa)",actions:{confirm:"Contrassegna come completata"}},confirm_remove:{title:"Rimuovi attivit\xE0",message:`Rimuovere "{title}"? L'operazione non pu\xF2 essere annullata.`,actions:{confirm:"Rimuovi"}},templates:{title:"Modelli di attivit\xE0",search:"Cerca modelli...",import_csv:"Importa da CSV",choose_csv:"Scegli file CSV",csv_hint:"Colonne: title (obbligatoria), description, interval_value, interval_type, last_performed (AAAA-MM-GG), icon, group_id",csv_empty:"Nessuna riga importabile trovata nel file.",no_matches:"Nessun modello corrisponde alla ricerca.",import_count:"{count, plural, one {Importa 1 attivit\xE0} other {Importa # attivit\xE0}}",imported:"{count, plural, one {1 attivit\xE0 importata.} other {# attivit\xE0 importate.}}",import_failed:"Importazione non riuscita: {titles}",preview:{title:"Titolo",interval:"Intervallo",last_performed:"Ultima esecuzione",group:"Gruppo"}}},toolbar:{add_task:"Aggiungi attivit\xE0",manage_groups:"Gestisci gruppi"},nav:{all_tasks:"Tutte le attivit\xE0",done_editing:"Fine"},list:{due_today:"Scade oggi",days_overdue:"{count, plural, one {1 giorno di ritardo} other {# giorni di ritardo}}",days_left:"{count, plural, one {Scade tra 1 giorno} other {# giorni rimanenti}}",search:"Cerca attivit\xE0...",all_groups:"Tutti i gruppi",overdue:"Scadute",due_soon:"In scadenza",upcoming:"In arrivo",no_tasks:"Nessuna attivit\xE0 trovata",done:"Completate",last_performed:"Ultima esecuzione",progress:"Avanzamento",history:"Cronologia",complete:"Completa",remove:"Rimuovi",all_caught_up:"Tutto in ordine",needs_attention:"{count, plural, one {1 attivit\xE0 richiede attenzione} other {# attivit\xE0 richiedono attenzione}}",done_today:"Fatte oggi",repeats:"Ripetizione",next_due:"Prossima scadenza: {date}",clear_search:"Cancella ricerca",group_by:"Raggruppa per",by_status:"Stato"},empty:{title:"Ancora nessuna attivit\xE0",message:"Aggiungi la tua prima attivit\xE0 o parti dalla libreria di modelli con le attivit\xE0 domestiche pi\xF9 comuni.",message_readonly:"Le attivit\xE0 aggiunte da un amministratore compariranno qui."}},Xa={categories:{hvac:"Climatizzazione",plumbing:"Idraulica",electrical:"Impianto elettrico",appliances:"Elettrodomestici",interior:"Interni",exterior:"Esterni",yard:"Giardino",safety:"Sicurezza",vehicles:"Veicoli"}},Ya={common:Ga,intervals:ja,trigger_types:Va,notifications:qa,card:Wa,panel:Za,templates:Xa};var Mt={};W(Mt,{card:()=>tn,common:()=>Ja,default:()=>nn,intervals:()=>Ka,notifications:()=>en,panel:()=>rn,templates:()=>an,trigger_types:()=>Qa});var Ja={loading:"Laden...",none:"Geen",no_tasks:"Geen taken gevonden.",ungrouped:"Niet gegroepeerd",cancel:"Annuleren",invalid_date:"Ongeldige datum ingevoerd."},Ka={day:"Dag",days:"Dagen",week:"Week",weeks:"Weken",month:"Maand",months:"Maanden",year:"Jaar",years:"Jaren",every_uses:"Om de {value} gebruiksbeurten",every_runtime:"Om de {value} draaitijd"},Qa={time:"Op basis van tijd",date:"Vaste datum",count:"Op basis van aantal",runtime:"Op basis van draaitijd"},en={when:{due:"Op vervaldatum",overdue:"Achterstallig",due_and_overdue:"Op vervaldatum en achterstallig"}},tn={add_task:{added:'"{title}" toegevoegd.',admin_only:"Alleen beheerders kunnen taken toevoegen."}},rn={cards:{new:{title:"Nieuwe taak aanmaken",fields:{title:{heading:"Taaktitel"},interval_value:{heading:"Interval"},interval_type:{heading:"Intervaltype"},last_performed:{heading:"Laatst uitgevoerd",helper:"Laat leeg om vandaag te gebruiken"},anchor_date:{heading:"Ankerdatum",helper:"Het schema herhaalt zich vanaf deze vaste datum"},tag:{heading:"Tag"},icon:{heading:"Pictogram"},label:{heading:"Label(s)"},area:{heading:"Ruimte"},description:{heading:"Beschrijving"},trigger_type:{heading:"Triggertype"},count_entity_id:{heading:"Getelde entiteit"},count_threshold:{heading:"Teldrempel"},runtime_entity_id:{heading:"Draaitijdsensor"},runtime_threshold:{heading:"Draaitijddrempel"},group_id:{heading:"Groep",helper:"Kies een groep of typ een nieuwe naam"},notifications_enabled:{heading:"Meldingen inschakelen"},notification_target:{heading:"Meldingsservice",helper:"Laat leeg om notify.notify te gebruiken"},notify_when:{heading:"Melden wanneer"},notify_days_before_due:{heading:"Dagen v\xF3\xF3r vervaldatum",helper:"Optionele vooruitlooptijd voor de herinnering"},notification_time:{heading:"Tijdstip",helper:"Wanneer automatische meldingen worden verzonden"},notification_url:{heading:"URL openen",helper:"Optionele URL voor de Open-actie van de melding"},active_months:{heading:"Actieve maanden",helper:"Seizoenstaken zijn alleen in deze maanden verschuldigd (leeg = het hele jaar)"}},sections:{optional:"Optionele instellingen",notifications:"Meldingen"},actions:{add_task:"Taak toevoegen"},alerts:{required:"Vul alle velden in",error:"Fout bij het toevoegen van de taak. Zie de console voor details."}},current:{next:"Volgende vervaldatum",actions:{edit:"Bewerken",move:"Verplaatsen naar groep",remove:"Verwijderen"},alerts:{complete_success:'"{title}" gemarkeerd als voltooid. De volgende vervaldatum is opnieuw berekend.',complete_error:"Kan de taak niet als voltooid markeren. Zie de console voor details.",remove_error:"Kan de taak niet verwijderen. Zie de console voor details."},filter:{search:"Taken zoeken...",templates:"Sjablonen bekijken",export:"CSV exporteren",clear:"Filters wissen"}},groups:{title:"Groepen",fields:{new_group:{heading:"Nieuwe groep"}},actions:{create:"Aanmaken",rename:"Hernoemen",delete:"Verwijderen",save:"Opslaan"},empty:"Nog geen groepen. Maak er een aan om je taken te organiseren.",confirm_delete:'Groep "{title}" verwijderen? De taken worden verplaatst naar Niet gegroepeerd.',alerts:{error:"Kan de groep niet aanmaken. Controleer de browserconsole en de Home Assistant-logboeken.",exists:'Groep "{title}" bestaat al.',rename_error:"Kan de groep niet hernoemen. Zie de console voor details.",delete_error:"Kan de groep niet verwijderen. Zie de console voor details."},confirm_delete_title:"Groep verwijderen"}},dialog:{edit_task:{title:"Taak bewerken",fields:{interval_value:{heading:"Interval"},interval_type:{heading:"Intervaltype"},last_performed:{heading:"Laatst uitgevoerd",helper:"Laat leeg om vandaag te gebruiken"},anchor_date:{heading:"Ankerdatum",helper:"Het schema herhaalt zich vanaf deze vaste datum"},tag:{heading:"Tag"},icon:{heading:"Pictogram"},label:{heading:"Label(s)"},area:{heading:"Ruimte"},trigger_type:{heading:"Triggertype"},count_entity_id:{heading:"Getelde entiteit"},count_threshold:{heading:"Teldrempel"},runtime_entity_id:{heading:"Draaitijdsensor"},runtime_threshold:{heading:"Draaitijddrempel"},title:{heading:"Titel"},description:{heading:"Beschrijving"},group_id:{heading:"Groep",helper:"Kies een groep of typ een nieuwe naam"},notifications_enabled:{heading:"Meldingen inschakelen"},notification_target:{heading:"Meldingsservice",helper:"Laat leeg om notify.notify te gebruiken"},notify_when:{heading:"Melden wanneer"},notify_days_before_due:{heading:"Dagen v\xF3\xF3r vervaldatum",helper:"Optionele vooruitlooptijd voor de herinnering"},notification_time:{heading:"Tijdstip",helper:"Wanneer automatische meldingen worden verzonden"},notification_url:{heading:"URL openen",helper:"Optionele URL voor de Open-actie van de melding"},active_months:{heading:"Actieve maanden",helper:"Seizoenstaken zijn alleen in deze maanden verschuldigd (leeg = het hele jaar)"}},sections:{optional:"Optionele instellingen",notifications:"Meldingen",history:"Geschiedenis"},actions:{cancel:"Annuleren",save:"Opslaan",test_notification:"Testmelding verzenden"},alerts:{error:"Kan de wijzigingen niet opslaan. Zie de console voor details.",test_error:"Kan de testmelding niet verzenden. Zie de console voor details."}},move_task:{title:"Taak verplaatsen",fields:{group_id:{heading:"Groep"}},actions:{cancel:"Annuleren",move:"Verplaatsen"}},confirm_complete:{title:"Taak als voltooid markeren",message:'"{title}" als voltooid markeren? Laatst uitgevoerd wordt teruggezet naar vandaag en de volgende vervaldatum wordt opnieuw berekend op basis van het interval {interval}.',message_progress:'"{title}" als voltooid markeren? De voortgang ({interval}) begint opnieuw.',note_label:"Notitie (optioneel)",actions:{confirm:"Als voltooid markeren"}},confirm_remove:{title:"Taak verwijderen",message:'"{title}" verwijderen? Dit kan niet ongedaan worden gemaakt.',actions:{confirm:"Verwijderen"}},templates:{title:"Taaksjablonen",search:"Sjablonen zoeken...",import_csv:"Importeren uit CSV",choose_csv:"CSV-bestand kiezen",csv_hint:"Kolommen: title (verplicht), description, interval_value, interval_type, last_performed (JJJJ-MM-DD), icon, group_id",csv_empty:"Geen importeerbare rijen gevonden in het bestand.",no_matches:"Geen sjablonen gevonden voor je zoekopdracht.",import_count:"{count, plural, one {1 taak importeren} other {# taken importeren}}",imported:"{count, plural, one {1 taak ge\xEFmporteerd.} other {# taken ge\xEFmporteerd.}}",import_failed:"Importeren mislukt: {titles}",preview:{title:"Titel",interval:"Interval",last_performed:"Laatst uitgevoerd",group:"Groep"}}},toolbar:{add_task:"Taak toevoegen",manage_groups:"Groepen beheren"},nav:{all_tasks:"Alle taken",done_editing:"Klaar"},list:{due_today:"Vervalt vandaag",days_overdue:"{count, plural, one {1 dag achterstallig} other {# dagen achterstallig}}",days_left:"{count, plural, one {Vervalt over 1 dag} other {Nog # dagen}}",search:"Taken zoeken...",all_groups:"Alle groepen",overdue:"Achterstallig",due_soon:"Vervalt binnenkort",upcoming:"Aankomend",no_tasks:"Geen taken gevonden",done:"Voltooid",last_performed:"Laatst uitgevoerd",progress:"Voortgang",history:"Geschiedenis",complete:"Voltooien",remove:"Verwijderen",all_caught_up:"Alles bijgewerkt",needs_attention:"{count, plural, one {1 taak vraagt aandacht} other {# taken vragen aandacht}}",done_today:"Vandaag gedaan",repeats:"Herhaling",next_due:"Volgende keer: {date}",clear_search:"Zoekopdracht wissen",group_by:"Groeperen op",by_status:"Status"},empty:{title:"Nog geen taken",message:"Voeg je eerste taak toe of begin met de sjabloonbibliotheek met veelvoorkomende huishoudelijke taken.",message_readonly:"Taken die een beheerder toevoegt, verschijnen hier."}},an={categories:{hvac:"Verwarming & airco",plumbing:"Sanitair",electrical:"Elektra",appliances:"Apparaten",interior:"Binnen",exterior:"Buiten",yard:"Tuin",safety:"Veiligheid",vehicles:"Voertuigen"}},nn={common:Ja,intervals:Ka,trigger_types:Qa,notifications:en,card:tn,panel:rn,templates:an};var Ut={};W(Ut,{card:()=>dn,common:()=>on,default:()=>hn,intervals:()=>sn,notifications:()=>cn,panel:()=>un,templates:()=>pn,trigger_types:()=>ln});var on={loading:"\u0141adowanie...",none:"Brak",no_tasks:"Nie znaleziono zada\u0144.",ungrouped:"Bez grupy",cancel:"Anuluj",invalid_date:"Wprowadzono nieprawid\u0142ow\u0105 dat\u0119."},sn={day:"Dzie\u0144",days:"Dni",week:"Tydzie\u0144",weeks:"Tygodnie",month:"Miesi\u0105c",months:"Miesi\u0105ce",year:"Rok",years:"Lata",every_uses:"Co {value} u\u017Cy\u0107",every_runtime:"Co {value} czasu pracy"},ln={time:"Na podstawie czasu",date:"Sta\u0142a data",count:"Na podstawie liczby u\u017Cy\u0107",runtime:"Na podstawie czasu pracy"},cn={when:{due:"Termin",overdue:"Po terminie",due_and_overdue:"Termin i po terminie"}},dn={add_task:{added:'Dodano "{title}".',admin_only:"Tylko administratorzy mog\u0105 dodawa\u0107 zadania."}},un={cards:{new:{title:"Utw\xF3rz nowe zadanie",fields:{title:{heading:"Tytu\u0142 zadania"},interval_value:{heading:"Interwa\u0142"},interval_type:{heading:"Typ interwa\u0142u"},last_performed:{heading:"Ostatnio wykonane",helper:"Pozostaw puste, aby u\u017Cy\u0107 dzisiejszej daty"},anchor_date:{heading:"Data odniesienia",helper:"Harmonogram powtarza si\u0119 od tej sta\u0142ej daty"},tag:{heading:"Tag"},icon:{heading:"Ikona"},label:{heading:"Etykieta(-y)"},area:{heading:"Obszar"},description:{heading:"Opis"},trigger_type:{heading:"Typ wyzwalacza"},count_entity_id:{heading:"Zliczana encja"},count_threshold:{heading:"Pr\xF3g liczby u\u017Cy\u0107"},runtime_entity_id:{heading:"Czujnik czasu pracy"},runtime_threshold:{heading:"Pr\xF3g czasu pracy"},group_id:{heading:"Grupa",helper:"Wybierz grup\u0119 lub wpisz now\u0105 nazw\u0119"},notifications_enabled:{heading:"W\u0142\u0105cz powiadomienia"},notification_target:{heading:"Us\u0142uga powiadomie\u0144",helper:"Pozostaw puste, aby u\u017Cy\u0107 notify.notify"},notify_when:{heading:"Powiadamiaj, gdy"},notify_days_before_due:{heading:"Dni przed terminem",helper:"Opcjonalne wyprzedzenie przypomnienia o zbli\u017Caj\u0105cym si\u0119 terminie"},notification_time:{heading:"Pora dnia",helper:"Kiedy wysy\u0142ane s\u0105 automatyczne powiadomienia"},notification_url:{heading:"Adres URL do otwarcia",helper:"Opcjonalny adres URL dla akcji Otw\xF3rz w powiadomieniu"},active_months:{heading:"Aktywne miesi\u0105ce",helper:"Zadania sezonowe s\u0105 wymagane tylko w tych miesi\u0105cach (puste = ca\u0142y rok)"}},sections:{optional:"Ustawienia opcjonalne",notifications:"Powiadomienia"},actions:{add_task:"Dodaj zadanie"},alerts:{required:"Wype\u0142nij wszystkie pola",error:"B\u0142\u0105d podczas dodawania zadania. Szczeg\xF3\u0142y w konsoli."}},current:{next:"Nast\u0119pny termin",actions:{edit:"Edytuj",move:"Przenie\u015B do grupy",remove:"Usu\u0144"},alerts:{complete_success:'"{title}" oznaczono jako wykonane. Nast\u0119pny termin zosta\u0142 przeliczony.',complete_error:"Nie uda\u0142o si\u0119 oznaczy\u0107 zadania jako wykonane. Szczeg\xF3\u0142y w konsoli.",remove_error:"Nie uda\u0142o si\u0119 usun\u0105\u0107 zadania. Szczeg\xF3\u0142y w konsoli."},filter:{search:"Szukaj zada\u0144...",templates:"Przegl\u0105daj szablony",export:"Eksportuj CSV",clear:"Wyczy\u015B\u0107 filtry"}},groups:{title:"Grupy",fields:{new_group:{heading:"Nowa grupa"}},actions:{create:"Utw\xF3rz",rename:"Zmie\u0144 nazw\u0119",delete:"Usu\u0144",save:"Zapisz"},empty:"Brak grup. Utw\xF3rz grup\u0119, aby uporz\u0105dkowa\u0107 zadania.",confirm_delete:'Usun\u0105\u0107 grup\u0119 "{title}"? Jej zadania trafi\u0105 do kategorii Bez grupy.',alerts:{error:"Nie uda\u0142o si\u0119 utworzy\u0107 grupy. Sprawd\u017A konsol\u0119 przegl\u0105darki i logi Home Assistant.",exists:'Grupa "{title}" ju\u017C istnieje.',rename_error:"Nie uda\u0142o si\u0119 zmieni\u0107 nazwy grupy. Szczeg\xF3\u0142y w konsoli.",delete_error:"Nie uda\u0142o si\u0119 usun\u0105\u0107 grupy. Szczeg\xF3\u0142y w konsoli."},confirm_delete_title:"Usu\u0144 grup\u0119"}},dialog:{edit_task:{title:"Edytuj zadanie",fields:{interval_value:{heading:"Interwa\u0142"},interval_type:{heading:"Typ interwa\u0142u"},last_performed:{heading:"Ostatnio wykonane",helper:"Pozostaw puste, aby u\u017Cy\u0107 dzisiejszej daty"},anchor_date:{heading:"Data odniesienia",helper:"Harmonogram powtarza si\u0119 od tej sta\u0142ej daty"},tag:{heading:"Tag"},icon:{heading:"Ikona"},label:{heading:"Etykieta(-y)"},area:{heading:"Obszar"},trigger_type:{heading:"Typ wyzwalacza"},count_entity_id:{heading:"Zliczana encja"},count_threshold:{heading:"Pr\xF3g liczby u\u017Cy\u0107"},runtime_entity_id:{heading:"Czujnik czasu pracy"},runtime_threshold:{heading:"Pr\xF3g czasu pracy"},title:{heading:"Tytu\u0142"},description:{heading:"Opis"},group_id:{heading:"Grupa",helper:"Wybierz grup\u0119 lub wpisz now\u0105 nazw\u0119"},notifications_enabled:{heading:"W\u0142\u0105cz powiadomienia"},notification_target:{heading:"Us\u0142uga powiadomie\u0144",helper:"Pozostaw puste, aby u\u017Cy\u0107 notify.notify"},notify_when:{heading:"Powiadamiaj, gdy"},notify_days_before_due:{heading:"Dni przed terminem",helper:"Opcjonalne wyprzedzenie przypomnienia o zbli\u017Caj\u0105cym si\u0119 terminie"},notification_time:{heading:"Pora dnia",helper:"Kiedy wysy\u0142ane s\u0105 automatyczne powiadomienia"},notification_url:{heading:"Adres URL do otwarcia",helper:"Opcjonalny adres URL dla akcji Otw\xF3rz w powiadomieniu"},active_months:{heading:"Aktywne miesi\u0105ce",helper:"Zadania sezonowe s\u0105 wymagane tylko w tych miesi\u0105cach (puste = ca\u0142y rok)"}},sections:{optional:"Ustawienia opcjonalne",notifications:"Powiadomienia",history:"Historia"},actions:{cancel:"Anuluj",save:"Zapisz",test_notification:"Wy\u015Blij powiadomienie testowe"},alerts:{error:"Nie uda\u0142o si\u0119 zapisa\u0107 zmian. Szczeg\xF3\u0142y w konsoli.",test_error:"Nie uda\u0142o si\u0119 wys\u0142a\u0107 powiadomienia testowego. Szczeg\xF3\u0142y w konsoli."}},move_task:{title:"Przenie\u015B zadanie",fields:{group_id:{heading:"Grupa"}},actions:{cancel:"Anuluj",move:"Przenie\u015B"}},confirm_complete:{title:"Oznacz zadanie jako wykonane",message:'Oznaczy\u0107 "{title}" jako wykonane? Data ostatniego wykonania zostanie ustawiona na dzi\u015B, a nast\u0119pny termin zostanie przeliczony na podstawie interwa\u0142u {interval}.',message_progress:'Oznaczy\u0107 "{title}" jako wykonane? Post\u0119p ({interval}) zacznie si\u0119 od nowa.',note_label:"Notatka (opcjonalnie)",actions:{confirm:"Oznacz jako wykonane"}},confirm_remove:{title:"Usu\u0144 zadanie",message:'Usun\u0105\u0107 "{title}"? Tej operacji nie mo\u017Cna cofn\u0105\u0107.',actions:{confirm:"Usu\u0144"}},templates:{title:"Szablony zada\u0144",search:"Szukaj szablon\xF3w...",import_csv:"Importuj z CSV",choose_csv:"Wybierz plik CSV",csv_hint:"Kolumny: title (wymagana), description, interval_value, interval_type, last_performed (RRRR-MM-DD), icon, group_id",csv_empty:"Nie znaleziono wierszy do zaimportowania.",no_matches:"\u017Baden szablon nie pasuje do wyszukiwania.",import_count:"{count, plural, one {Importuj 1 zadanie} few {Importuj # zadania} many {Importuj # zada\u0144} other {Importuj # zadania}}",imported:"{count, plural, one {Zaimportowano 1 zadanie.} few {Zaimportowano # zadania.} many {Zaimportowano # zada\u0144.} other {Zaimportowano # zadania.}}",import_failed:"Nie uda\u0142o si\u0119 zaimportowa\u0107: {titles}",preview:{title:"Tytu\u0142",interval:"Interwa\u0142",last_performed:"Ostatnio wykonano",group:"Grupa"}}},toolbar:{add_task:"Dodaj zadanie",manage_groups:"Zarz\u0105dzaj grupami"},nav:{all_tasks:"Wszystkie zadania",done_editing:"Gotowe"},list:{due_today:"Termin dzisiaj",days_overdue:"{count, plural, one {1 dzie\u0144 po terminie} few {# dni po terminie} many {# dni po terminie} other {# dnia po terminie}}",days_left:"{count, plural, one {Termin za 1 dzie\u0144} few {Zosta\u0142y # dni} many {Zosta\u0142o # dni} other {Zosta\u0142o # dnia}}",search:"Szukaj zada\u0144...",all_groups:"Wszystkie grupy",overdue:"Po terminie",due_soon:"Wkr\xF3tce termin",upcoming:"Nadchodz\u0105ce",no_tasks:"Nie znaleziono zada\u0144",done:"Wykonane",last_performed:"Ostatnio wykonane",progress:"Post\u0119p",history:"Historia",complete:"Wykonane",remove:"Usu\u0144",all_caught_up:"Wszystko zrobione",needs_attention:"{count, plural, one {1 zadanie wymaga uwagi} few {# zadania wymagaj\u0105 uwagi} many {# zada\u0144 wymaga uwagi} other {# zadania wymaga uwagi}}",done_today:"Zrobione dzisiaj",repeats:"Powtarzanie",next_due:"Nast\u0119pny termin: {date}",clear_search:"Wyczy\u015B\u0107 wyszukiwanie",group_by:"Grupuj wed\u0142ug",by_status:"Status"},empty:{title:"Brak zada\u0144",message:"Dodaj pierwsze zadanie lub zacznij od biblioteki szablon\xF3w typowych prac domowych.",message_readonly:"Zadania dodane przez administratora pojawi\u0105 si\u0119 tutaj."}},pn={categories:{hvac:"Ogrzewanie i klimatyzacja",plumbing:"Hydraulika",electrical:"Elektryka",appliances:"Sprz\u0119t AGD",interior:"Wn\u0119trze",exterior:"Na zewn\u0105trz",yard:"Ogr\xF3d",safety:"Bezpiecze\u0144stwo",vehicles:"Pojazdy"}},hn={common:on,intervals:sn,trigger_types:ln,notifications:cn,card:dn,panel:un,templates:pn};var Gt={};W(Gt,{card:()=>vn,common:()=>mn,default:()=>xn,intervals:()=>gn,notifications:()=>_n,panel:()=>yn,templates:()=>bn,trigger_types:()=>fn});var mn={loading:"Carregando...",none:"Nenhum",no_tasks:"Nenhuma tarefa encontrada.",ungrouped:"Sem grupo",cancel:"Cancelar",invalid_date:"Data inv\xE1lida."},gn={day:"Dia",days:"Dias",week:"Semana",weeks:"Semanas",month:"M\xEAs",months:"Meses",year:"Ano",years:"Anos",every_uses:"A cada {value} usos",every_runtime:"A cada {value} de tempo de uso"},fn={time:"Por tempo",date:"Data fixa",count:"Por contagem",runtime:"Por tempo de uso"},_n={when:{due:"No vencimento",overdue:"Em atraso",due_and_overdue:"No vencimento e em atraso"}},vn={add_task:{added:'"{title}" adicionada.',admin_only:"Somente administradores podem adicionar tarefas."}},yn={cards:{new:{title:"Criar nova tarefa",fields:{title:{heading:"T\xEDtulo da tarefa"},interval_value:{heading:"Intervalo"},interval_type:{heading:"Tipo de intervalo"},last_performed:{heading:"\xDAltima execu\xE7\xE3o",helper:"Deixe em branco para usar hoje"},anchor_date:{heading:"Data de refer\xEAncia",helper:"O agendamento se repete a partir desta data fixa"},tag:{heading:"Tag"},icon:{heading:"\xCDcone"},label:{heading:"Etiqueta(s)"},area:{heading:"\xC1rea"},description:{heading:"Descri\xE7\xE3o"},trigger_type:{heading:"Tipo de gatilho"},count_entity_id:{heading:"Entidade contada"},count_threshold:{heading:"Limite de contagem"},runtime_entity_id:{heading:"Sensor de tempo de uso"},runtime_threshold:{heading:"Limite de tempo de uso"},group_id:{heading:"Grupo",helper:"Escolha um grupo ou digite um novo nome"},notifications_enabled:{heading:"Ativar notifica\xE7\xF5es"},notification_target:{heading:"Servi\xE7o de notifica\xE7\xE3o",helper:"Deixe em branco para usar notify.notify"},notify_when:{heading:"Notificar quando"},notify_days_before_due:{heading:"Dias antes do vencimento",helper:"Anteced\xEAncia opcional do lembrete de vencimento"},notification_time:{heading:"Hor\xE1rio do dia",helper:"Quando as notifica\xE7\xF5es autom\xE1ticas s\xE3o enviadas"},notification_url:{heading:"URL para abrir",helper:"URL opcional para a a\xE7\xE3o Abrir da notifica\xE7\xE3o"},active_months:{heading:"Meses ativos",helper:"Tarefas sazonais s\xF3 vencem nesses meses (vazio = o ano todo)"}},sections:{optional:"Configura\xE7\xF5es opcionais",notifications:"Notifica\xE7\xF5es"},actions:{add_task:"Adicionar tarefa"},alerts:{required:"Preencha todos os campos",error:"Erro ao adicionar a tarefa. Veja o console para detalhes."}},current:{next:"Pr\xF3ximo vencimento",actions:{edit:"Editar",move:"Mover para grupo",remove:"Remover"},alerts:{complete_success:'"{title}" marcada como conclu\xEDda. O pr\xF3ximo vencimento foi recalculado.',complete_error:"Falha ao marcar a tarefa como conclu\xEDda. Veja o console para detalhes.",remove_error:"Falha ao remover a tarefa. Veja o console para detalhes."},filter:{search:"Pesquisar tarefas...",templates:"Explorar modelos",export:"Exportar CSV",clear:"Limpar filtros"}},groups:{title:"Grupos",fields:{new_group:{heading:"Novo grupo"}},actions:{create:"Criar",rename:"Renomear",delete:"Excluir",save:"Salvar"},empty:"Nenhum grupo ainda. Crie um para organizar suas tarefas.",confirm_delete:'Excluir o grupo "{title}"? Suas tarefas ir\xE3o para Sem grupo.',alerts:{error:"Falha ao criar o grupo. Verifique o console do navegador e os logs do Home Assistant.",exists:'O grupo "{title}" j\xE1 existe.',rename_error:"Falha ao renomear o grupo. Veja o console para detalhes.",delete_error:"Falha ao excluir o grupo. Veja o console para detalhes."},confirm_delete_title:"Excluir grupo"}},dialog:{edit_task:{title:"Editar tarefa",fields:{interval_value:{heading:"Intervalo"},interval_type:{heading:"Tipo de intervalo"},last_performed:{heading:"\xDAltima execu\xE7\xE3o",helper:"Deixe em branco para usar hoje"},anchor_date:{heading:"Data de refer\xEAncia",helper:"O agendamento se repete a partir desta data fixa"},tag:{heading:"Tag"},icon:{heading:"\xCDcone"},label:{heading:"Etiqueta(s)"},area:{heading:"\xC1rea"},trigger_type:{heading:"Tipo de gatilho"},count_entity_id:{heading:"Entidade contada"},count_threshold:{heading:"Limite de contagem"},runtime_entity_id:{heading:"Sensor de tempo de uso"},runtime_threshold:{heading:"Limite de tempo de uso"},title:{heading:"T\xEDtulo"},description:{heading:"Descri\xE7\xE3o"},group_id:{heading:"Grupo",helper:"Escolha um grupo ou digite um novo nome"},notifications_enabled:{heading:"Ativar notifica\xE7\xF5es"},notification_target:{heading:"Servi\xE7o de notifica\xE7\xE3o",helper:"Deixe em branco para usar notify.notify"},notify_when:{heading:"Notificar quando"},notify_days_before_due:{heading:"Dias antes do vencimento",helper:"Anteced\xEAncia opcional do lembrete de vencimento"},notification_time:{heading:"Hor\xE1rio do dia",helper:"Quando as notifica\xE7\xF5es autom\xE1ticas s\xE3o enviadas"},notification_url:{heading:"URL para abrir",helper:"URL opcional para a a\xE7\xE3o Abrir da notifica\xE7\xE3o"},active_months:{heading:"Meses ativos",helper:"Tarefas sazonais s\xF3 vencem nesses meses (vazio = o ano todo)"}},sections:{optional:"Configura\xE7\xF5es opcionais",notifications:"Notifica\xE7\xF5es",history:"Hist\xF3rico"},actions:{cancel:"Cancelar",save:"Salvar",test_notification:"Enviar notifica\xE7\xE3o de teste"},alerts:{error:"Falha ao salvar as altera\xE7\xF5es. Veja o console para detalhes.",test_error:"Falha ao enviar a notifica\xE7\xE3o de teste. Veja o console para detalhes."}},move_task:{title:"Mover tarefa",fields:{group_id:{heading:"Grupo"}},actions:{cancel:"Cancelar",move:"Mover"}},confirm_complete:{title:"Marcar tarefa como conclu\xEDda",message:'Marcar "{title}" como conclu\xEDda? A \xFAltima execu\xE7\xE3o ser\xE1 redefinida para hoje e o pr\xF3ximo vencimento ser\xE1 recalculado com base no intervalo de {interval}.',message_progress:'Marcar "{title}" como conclu\xEDda? O progresso ({interval}) recome\xE7ar\xE1 do zero.',note_label:"Nota (opcional)",actions:{confirm:"Marcar como conclu\xEDda"}},confirm_remove:{title:"Remover tarefa",message:'Remover "{title}"? Isso n\xE3o pode ser desfeito.',actions:{confirm:"Remover"}},templates:{title:"Modelos de tarefas",search:"Pesquisar modelos...",import_csv:"Importar de CSV",choose_csv:"Escolher arquivo CSV",csv_hint:"Colunas: title (obrigat\xF3ria), description, interval_value, interval_type, last_performed (AAAA-MM-DD), icon, group_id",csv_empty:"Nenhuma linha import\xE1vel encontrada no arquivo.",no_matches:"Nenhum modelo corresponde \xE0 sua pesquisa.",import_count:"{count, plural, one {Importar 1 tarefa} other {Importar # tarefas}}",imported:"{count, plural, one {1 tarefa importada.} other {# tarefas importadas.}}",import_failed:"Falha ao importar: {titles}",preview:{title:"T\xEDtulo",interval:"Intervalo",last_performed:"\xDAltima execu\xE7\xE3o",group:"Grupo"}}},toolbar:{add_task:"Adicionar tarefa",manage_groups:"Gerenciar grupos"},nav:{all_tasks:"Todas as tarefas",done_editing:"Concluir"},list:{due_today:"Vence hoje",days_overdue:"{count, plural, one {1 dia de atraso} other {# dias de atraso}}",days_left:"{count, plural, one {Vence em 1 dia} other {Faltam # dias}}",search:"Pesquisar tarefas...",all_groups:"Todos os grupos",overdue:"Atrasadas",due_soon:"Vence em breve",upcoming:"Pr\xF3ximas",no_tasks:"Nenhuma tarefa encontrada",done:"Conclu\xEDdas",last_performed:"\xDAltima execu\xE7\xE3o",progress:"Progresso",history:"Hist\xF3rico",complete:"Concluir",remove:"Remover",all_caught_up:"Tudo em dia",needs_attention:"{count, plural, one {1 tarefa precisa de aten\xE7\xE3o} other {# tarefas precisam de aten\xE7\xE3o}}",done_today:"Feito hoje",repeats:"Repete",next_due:"Pr\xF3ximo vencimento: {date}",clear_search:"Limpar busca",group_by:"Agrupar por",by_status:"Status"},empty:{title:"Nenhuma tarefa ainda",message:"Adicione sua primeira tarefa ou comece pela biblioteca de modelos de tarefas dom\xE9sticas comuns.",message_readonly:"As tarefas adicionadas por um administrador aparecer\xE3o aqui."}},bn={categories:{hvac:"Climatiza\xE7\xE3o",plumbing:"Hidr\xE1ulica",electrical:"El\xE9trica",appliances:"Eletrodom\xE9sticos",interior:"Interior",exterior:"Exterior",yard:"Jardim",safety:"Seguran\xE7a",vehicles:"Ve\xEDculos"}},xn={common:mn,intervals:gn,trigger_types:fn,notifications:_n,card:vn,panel:yn,templates:bn};var jt=function(e,i){return jt=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,r){t.__proto__=r}||function(t,r){for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a])},jt(e,i)};function Le(e,i){if(typeof i!="function"&&i!==null)throw new TypeError("Class extends value "+String(i)+" is not a constructor or null");jt(e,i);function t(){this.constructor=e}e.prototype=i===null?Object.create(i):(t.prototype=i.prototype,new t)}var k=function(){return k=Object.assign||function(i){for(var t,r=1,a=arguments.length;r<a;r++){t=arguments[r];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(i[n]=t[n])}return i},k.apply(this,arguments)};function Qe(e,i,t){if(t||arguments.length===2)for(var r=0,a=i.length,n;r<a;r++)(n||!(r in i))&&(n||(n=Array.prototype.slice.call(i,0,r)),n[r]=i[r]);return e.concat(n||Array.prototype.slice.call(i))}var w;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(w||(w={}));var S;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(S||(S={}));var pe;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(pe||(pe={}));function Vt(e){return e.type===S.literal}function Ri(e){return e.type===S.argument}function et(e){return e.type===S.number}function tt(e){return e.type===S.date}function it(e){return e.type===S.time}function rt(e){return e.type===S.select}function at(e){return e.type===S.plural}function Li(e){return e.type===S.pound}function nt(e){return e.type===S.tag}function ot(e){return!!(e&&typeof e=="object"&&e.type===pe.number)}function Ne(e){return!!(e&&typeof e=="object"&&e.type===pe.dateTime)}var qt=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var wn=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function Ni(e){var i={};return e.replace(wn,function(t){var r=t.length;switch(t[0]){case"G":i.era=r===4?"long":r===5?"narrow":"short";break;case"y":i.year=r===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":i.month=["numeric","2-digit","short","long","narrow"][r-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":i.day=["numeric","2-digit"][r-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":i.weekday=r===4?"short":r===5?"narrow":"short";break;case"e":if(r<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");i.weekday=["short","long","narrow","short"][r-4];break;case"c":if(r<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");i.weekday=["short","long","narrow","short"][r-4];break;case"a":i.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":i.hourCycle="h12",i.hour=["numeric","2-digit"][r-1];break;case"H":i.hourCycle="h23",i.hour=["numeric","2-digit"][r-1];break;case"K":i.hourCycle="h11",i.hour=["numeric","2-digit"][r-1];break;case"k":i.hourCycle="h24",i.hour=["numeric","2-digit"][r-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":i.minute=["numeric","2-digit"][r-1];break;case"s":i.second=["numeric","2-digit"][r-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":i.timeZoneName=r<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),i}var Pi=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function Fi(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var i=e.split(Pi).filter(function(f){return f.length>0}),t=[],r=0,a=i;r<a.length;r++){var n=a[r],o=n.split("/");if(o.length===0)throw new Error("Invalid number skeleton");for(var s=o[0],c=o.slice(1),u=0,g=c;u<g.length;u++){var m=g[u];if(m.length===0)throw new Error("Invalid number skeleton")}t.push({stem:s,options:c})}return t}function kn(e){return e.replace(/^(.*?)-/,"")}var Bi=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,Mi=/^(@+)?(\+|#+)?[rs]?$/g,Tn=/(\*)(0+)|(#+)(0+)|(0+)/g,Ui=/^(0+)$/;function Hi(e){var i={};return e[e.length-1]==="r"?i.roundingPriority="morePrecision":e[e.length-1]==="s"&&(i.roundingPriority="lessPrecision"),e.replace(Mi,function(t,r,a){return typeof a!="string"?(i.minimumSignificantDigits=r.length,i.maximumSignificantDigits=r.length):a==="+"?i.minimumSignificantDigits=r.length:r[0]==="#"?i.maximumSignificantDigits=r.length:(i.minimumSignificantDigits=r.length,i.maximumSignificantDigits=r.length+(typeof a=="string"?a.length:0)),""}),i}function Gi(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function En(e){var i;if(e[0]==="E"&&e[1]==="E"?(i={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(i={notation:"scientific"},e=e.slice(1)),i){var t=e.slice(0,2);if(t==="+!"?(i.signDisplay="always",e=e.slice(2)):t==="+?"&&(i.signDisplay="exceptZero",e=e.slice(2)),!Ui.test(e))throw new Error("Malformed concise eng/scientific notation");i.minimumIntegerDigits=e.length}return i}function Oi(e){var i={},t=Gi(e);return t||i}function ji(e){for(var i={},t=0,r=e;t<r.length;t++){var a=r[t];switch(a.stem){case"percent":case"%":i.style="percent";continue;case"%x100":i.style="percent",i.scale=100;continue;case"currency":i.style="currency",i.currency=a.options[0];continue;case"group-off":case",_":i.useGrouping=!1;continue;case"precision-integer":case".":i.maximumFractionDigits=0;continue;case"measure-unit":case"unit":i.style="unit",i.unit=kn(a.options[0]);continue;case"compact-short":case"K":i.notation="compact",i.compactDisplay="short";continue;case"compact-long":case"KK":i.notation="compact",i.compactDisplay="long";continue;case"scientific":i=k(k(k({},i),{notation:"scientific"}),a.options.reduce(function(c,u){return k(k({},c),Oi(u))},{}));continue;case"engineering":i=k(k(k({},i),{notation:"engineering"}),a.options.reduce(function(c,u){return k(k({},c),Oi(u))},{}));continue;case"notation-simple":i.notation="standard";continue;case"unit-width-narrow":i.currencyDisplay="narrowSymbol",i.unitDisplay="narrow";continue;case"unit-width-short":i.currencyDisplay="code",i.unitDisplay="short";continue;case"unit-width-full-name":i.currencyDisplay="name",i.unitDisplay="long";continue;case"unit-width-iso-code":i.currencyDisplay="symbol";continue;case"scale":i.scale=parseFloat(a.options[0]);continue;case"integer-width":if(a.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");a.options[0].replace(Tn,function(c,u,g,m,f,v){if(u)i.minimumIntegerDigits=g.length;else{if(m&&f)throw new Error("We currently do not support maximum integer digits");if(v)throw new Error("We currently do not support exact integer digits")}return""});continue}if(Ui.test(a.stem)){i.minimumIntegerDigits=a.stem.length;continue}if(Bi.test(a.stem)){if(a.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");a.stem.replace(Bi,function(c,u,g,m,f,v){return g==="*"?i.minimumFractionDigits=u.length:m&&m[0]==="#"?i.maximumFractionDigits=m.length:f&&v?(i.minimumFractionDigits=f.length,i.maximumFractionDigits=f.length+v.length):(i.minimumFractionDigits=u.length,i.maximumFractionDigits=u.length),""});var n=a.options[0];n==="w"?i=k(k({},i),{trailingZeroDisplay:"stripIfInteger"}):n&&(i=k(k({},i),Hi(n)));continue}if(Mi.test(a.stem)){i=k(k({},i),Hi(a.stem));continue}var o=Gi(a.stem);o&&(i=k(k({},i),o));var s=En(a.stem);s&&(i=k(k({},i),s))}return i}var Pe={AX:["H"],BQ:["H"],CP:["H"],CZ:["H"],DK:["H"],FI:["H"],ID:["H"],IS:["H"],ML:["H"],NE:["H"],RU:["H"],SE:["H"],SJ:["H"],SK:["H"],AS:["h","H"],BT:["h","H"],DJ:["h","H"],ER:["h","H"],GH:["h","H"],IN:["h","H"],LS:["h","H"],PG:["h","H"],PW:["h","H"],SO:["h","H"],TO:["h","H"],VU:["h","H"],WS:["h","H"],"001":["H","h"],AL:["h","H","hB"],TD:["h","H","hB"],"ca-ES":["H","h","hB"],CF:["H","h","hB"],CM:["H","h","hB"],"fr-CA":["H","h","hB"],"gl-ES":["H","h","hB"],"it-CH":["H","h","hB"],"it-IT":["H","h","hB"],LU:["H","h","hB"],NP:["H","h","hB"],PF:["H","h","hB"],SC:["H","h","hB"],SM:["H","h","hB"],SN:["H","h","hB"],TF:["H","h","hB"],VA:["H","h","hB"],CY:["h","H","hb","hB"],GR:["h","H","hb","hB"],CO:["h","H","hB","hb"],DO:["h","H","hB","hb"],KP:["h","H","hB","hb"],KR:["h","H","hB","hb"],NA:["h","H","hB","hb"],PA:["h","H","hB","hb"],PR:["h","H","hB","hb"],VE:["h","H","hB","hb"],AC:["H","h","hb","hB"],AI:["H","h","hb","hB"],BW:["H","h","hb","hB"],BZ:["H","h","hb","hB"],CC:["H","h","hb","hB"],CK:["H","h","hb","hB"],CX:["H","h","hb","hB"],DG:["H","h","hb","hB"],FK:["H","h","hb","hB"],GB:["H","h","hb","hB"],GG:["H","h","hb","hB"],GI:["H","h","hb","hB"],IE:["H","h","hb","hB"],IM:["H","h","hb","hB"],IO:["H","h","hb","hB"],JE:["H","h","hb","hB"],LT:["H","h","hb","hB"],MK:["H","h","hb","hB"],MN:["H","h","hb","hB"],MS:["H","h","hb","hB"],NF:["H","h","hb","hB"],NG:["H","h","hb","hB"],NR:["H","h","hb","hB"],NU:["H","h","hb","hB"],PN:["H","h","hb","hB"],SH:["H","h","hb","hB"],SX:["H","h","hb","hB"],TA:["H","h","hb","hB"],ZA:["H","h","hb","hB"],"af-ZA":["H","h","hB","hb"],AR:["H","h","hB","hb"],CL:["H","h","hB","hb"],CR:["H","h","hB","hb"],CU:["H","h","hB","hb"],EA:["H","h","hB","hb"],"es-BO":["H","h","hB","hb"],"es-BR":["H","h","hB","hb"],"es-EC":["H","h","hB","hb"],"es-ES":["H","h","hB","hb"],"es-GQ":["H","h","hB","hb"],"es-PE":["H","h","hB","hb"],GT:["H","h","hB","hb"],HN:["H","h","hB","hb"],IC:["H","h","hB","hb"],KG:["H","h","hB","hb"],KM:["H","h","hB","hb"],LK:["H","h","hB","hb"],MA:["H","h","hB","hb"],MX:["H","h","hB","hb"],NI:["H","h","hB","hb"],PY:["H","h","hB","hb"],SV:["H","h","hB","hb"],UY:["H","h","hB","hb"],JP:["H","h","K"],AD:["H","hB"],AM:["H","hB"],AO:["H","hB"],AT:["H","hB"],AW:["H","hB"],BE:["H","hB"],BF:["H","hB"],BJ:["H","hB"],BL:["H","hB"],BR:["H","hB"],CG:["H","hB"],CI:["H","hB"],CV:["H","hB"],DE:["H","hB"],EE:["H","hB"],FR:["H","hB"],GA:["H","hB"],GF:["H","hB"],GN:["H","hB"],GP:["H","hB"],GW:["H","hB"],HR:["H","hB"],IL:["H","hB"],IT:["H","hB"],KZ:["H","hB"],MC:["H","hB"],MD:["H","hB"],MF:["H","hB"],MQ:["H","hB"],MZ:["H","hB"],NC:["H","hB"],NL:["H","hB"],PM:["H","hB"],PT:["H","hB"],RE:["H","hB"],RO:["H","hB"],SI:["H","hB"],SR:["H","hB"],ST:["H","hB"],TG:["H","hB"],TR:["H","hB"],WF:["H","hB"],YT:["H","hB"],BD:["h","hB","H"],PK:["h","hB","H"],AZ:["H","hB","h"],BA:["H","hB","h"],BG:["H","hB","h"],CH:["H","hB","h"],GE:["H","hB","h"],LI:["H","hB","h"],ME:["H","hB","h"],RS:["H","hB","h"],UA:["H","hB","h"],UZ:["H","hB","h"],XK:["H","hB","h"],AG:["h","hb","H","hB"],AU:["h","hb","H","hB"],BB:["h","hb","H","hB"],BM:["h","hb","H","hB"],BS:["h","hb","H","hB"],CA:["h","hb","H","hB"],DM:["h","hb","H","hB"],"en-001":["h","hb","H","hB"],FJ:["h","hb","H","hB"],FM:["h","hb","H","hB"],GD:["h","hb","H","hB"],GM:["h","hb","H","hB"],GU:["h","hb","H","hB"],GY:["h","hb","H","hB"],JM:["h","hb","H","hB"],KI:["h","hb","H","hB"],KN:["h","hb","H","hB"],KY:["h","hb","H","hB"],LC:["h","hb","H","hB"],LR:["h","hb","H","hB"],MH:["h","hb","H","hB"],MP:["h","hb","H","hB"],MW:["h","hb","H","hB"],NZ:["h","hb","H","hB"],SB:["h","hb","H","hB"],SG:["h","hb","H","hB"],SL:["h","hb","H","hB"],SS:["h","hb","H","hB"],SZ:["h","hb","H","hB"],TC:["h","hb","H","hB"],TT:["h","hb","H","hB"],UM:["h","hb","H","hB"],US:["h","hb","H","hB"],VC:["h","hb","H","hB"],VG:["h","hb","H","hB"],VI:["h","hb","H","hB"],ZM:["h","hb","H","hB"],BO:["H","hB","h","hb"],EC:["H","hB","h","hb"],ES:["H","hB","h","hb"],GQ:["H","hB","h","hb"],PE:["H","hB","h","hb"],AE:["h","hB","hb","H"],"ar-001":["h","hB","hb","H"],BH:["h","hB","hb","H"],DZ:["h","hB","hb","H"],EG:["h","hB","hb","H"],EH:["h","hB","hb","H"],HK:["h","hB","hb","H"],IQ:["h","hB","hb","H"],JO:["h","hB","hb","H"],KW:["h","hB","hb","H"],LB:["h","hB","hb","H"],LY:["h","hB","hb","H"],MO:["h","hB","hb","H"],MR:["h","hB","hb","H"],OM:["h","hB","hb","H"],PH:["h","hB","hb","H"],PS:["h","hB","hb","H"],QA:["h","hB","hb","H"],SA:["h","hB","hb","H"],SD:["h","hB","hb","H"],SY:["h","hB","hb","H"],TN:["h","hB","hb","H"],YE:["h","hB","hb","H"],AF:["H","hb","hB","h"],LA:["H","hb","hB","h"],CN:["H","hB","hb","h"],LV:["H","hB","hb","h"],TL:["H","hB","hb","h"],"zu-ZA":["H","hB","hb","h"],CD:["hB","H"],IR:["hB","H"],"hi-IN":["hB","h","H"],"kn-IN":["hB","h","H"],"ml-IN":["hB","h","H"],"te-IN":["hB","h","H"],KH:["hB","h","H","hb"],"ta-IN":["hB","h","hb","H"],BN:["hb","hB","h","H"],MY:["hb","hB","h","H"],ET:["hB","hb","h","H"],"gu-IN":["hB","hb","h","H"],"mr-IN":["hB","hb","h","H"],"pa-IN":["hB","hb","h","H"],TW:["hB","hb","h","H"],KE:["hB","hb","H","h"],MM:["hB","hb","H","h"],TZ:["hB","hb","H","h"],UG:["hB","hb","H","h"]};function Vi(e,i){for(var t="",r=0;r<e.length;r++){var a=e.charAt(r);if(a==="j"){for(var n=0;r+1<e.length&&e.charAt(r+1)===a;)n++,r++;var o=1+(n&1),s=n<2?1:3+(n>>1),c="a",u=Sn(i);for((u=="H"||u=="k")&&(s=0);s-- >0;)t+=c;for(;o-- >0;)t=u+t}else a==="J"?t+="H":t+=a}return t}function Sn(e){var i=e.hourCycle;if(i===void 0&&e.hourCycles&&e.hourCycles.length&&(i=e.hourCycles[0]),i)switch(i){case"h24":return"k";case"h23":return"H";case"h12":return"h";case"h11":return"K";default:throw new Error("Invalid hourCycle")}var t=e.language,r;t!=="root"&&(r=e.maximize().region);var a=Pe[r||""]||Pe[t||""]||Pe["".concat(t,"-001")]||Pe["001"];return a[0]}var Wt,An=new RegExp("^".concat(qt.source,"*")),$n=new RegExp("".concat(qt.source,"*$"));function T(e,i){return{start:e,end:i}}var Cn=!!String.prototype.startsWith,Dn=!!String.fromCodePoint,zn=!!Object.fromEntries,In=!!String.prototype.codePointAt,Rn=!!String.prototype.trimStart,Ln=!!String.prototype.trimEnd,Nn=!!Number.isSafeInteger,Pn=Nn?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},Xt=!0;try{qi=Yi("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),Xt=((Wt=qi.exec("a"))===null||Wt===void 0?void 0:Wt[0])==="a"}catch{Xt=!1}var qi,Wi=Cn?function(i,t,r){return i.startsWith(t,r)}:function(i,t,r){return i.slice(r,r+t.length)===t},Yt=Dn?String.fromCodePoint:function(){for(var i=[],t=0;t<arguments.length;t++)i[t]=arguments[t];for(var r="",a=i.length,n=0,o;a>n;){if(o=i[n++],o>1114111)throw RangeError(o+" is not a valid code point");r+=o<65536?String.fromCharCode(o):String.fromCharCode(((o-=65536)>>10)+55296,o%1024+56320)}return r},Zi=zn?Object.fromEntries:function(i){for(var t={},r=0,a=i;r<a.length;r++){var n=a[r],o=n[0],s=n[1];t[o]=s}return t},Xi=In?function(i,t){return i.codePointAt(t)}:function(i,t){var r=i.length;if(!(t<0||t>=r)){var a=i.charCodeAt(t),n;return a<55296||a>56319||t+1===r||(n=i.charCodeAt(t+1))<56320||n>57343?a:(a-55296<<10)+(n-56320)+65536}},Bn=Rn?function(i){return i.trimStart()}:function(i){return i.replace(An,"")},Hn=Ln?function(i){return i.trimEnd()}:function(i){return i.replace($n,"")};function Yi(e,i){return new RegExp(e,i)}var Jt;Xt?(Zt=Yi("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),Jt=function(i,t){var r;Zt.lastIndex=t;var a=Zt.exec(i);return(r=a[1])!==null&&r!==void 0?r:""}):Jt=function(i,t){for(var r=[];;){var a=Xi(i,t);if(a===void 0||Ki(a)||Mn(a))break;r.push(a),t+=a>=65536?2:1}return Yt.apply(void 0,r)};var Zt,Ji=(function(){function e(i,t){t===void 0&&(t={}),this.message=i,this.position={offset:0,line:1,column:1},this.ignoreTag=!!t.ignoreTag,this.locale=t.locale,this.requiresOtherClause=!!t.requiresOtherClause,this.shouldParseSkeletons=!!t.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(i,t,r){for(var a=[];!this.isEOF();){var n=this.char();if(n===123){var o=this.parseArgument(i,r);if(o.err)return o;a.push(o.val)}else{if(n===125&&i>0)break;if(n===35&&(t==="plural"||t==="selectordinal")){var s=this.clonePosition();this.bump(),a.push({type:S.pound,location:T(s,this.clonePosition())})}else if(n===60&&!this.ignoreTag&&this.peek()===47){if(r)break;return this.error(w.UNMATCHED_CLOSING_TAG,T(this.clonePosition(),this.clonePosition()))}else if(n===60&&!this.ignoreTag&&Kt(this.peek()||0)){var o=this.parseTag(i,t);if(o.err)return o;a.push(o.val)}else{var o=this.parseLiteral(i,t);if(o.err)return o;a.push(o.val)}}}return{val:a,err:null}},e.prototype.parseTag=function(i,t){var r=this.clonePosition();this.bump();var a=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:S.literal,value:"<".concat(a,"/>"),location:T(r,this.clonePosition())},err:null};if(this.bumpIf(">")){var n=this.parseMessage(i+1,t,!0);if(n.err)return n;var o=n.val,s=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!Kt(this.char()))return this.error(w.INVALID_TAG,T(s,this.clonePosition()));var c=this.clonePosition(),u=this.parseTagName();return a!==u?this.error(w.UNMATCHED_CLOSING_TAG,T(c,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:S.tag,value:a,children:o,location:T(r,this.clonePosition())},err:null}:this.error(w.INVALID_TAG,T(s,this.clonePosition())))}else return this.error(w.UNCLOSED_TAG,T(r,this.clonePosition()))}else return this.error(w.INVALID_TAG,T(r,this.clonePosition()))},e.prototype.parseTagName=function(){var i=this.offset();for(this.bump();!this.isEOF()&&Fn(this.char());)this.bump();return this.message.slice(i,this.offset())},e.prototype.parseLiteral=function(i,t){for(var r=this.clonePosition(),a="";;){var n=this.tryParseQuote(t);if(n){a+=n;continue}var o=this.tryParseUnquoted(i,t);if(o){a+=o;continue}var s=this.tryParseLeftAngleBracket();if(s){a+=s;continue}break}var c=T(r,this.clonePosition());return{val:{type:S.literal,value:a,location:c},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!On(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(i){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(i==="plural"||i==="selectordinal")break;return null;default:return null}this.bump();var t=[this.char()];for(this.bump();!this.isEOF();){var r=this.char();if(r===39)if(this.peek()===39)t.push(39),this.bump();else{this.bump();break}else t.push(r);this.bump()}return Yt.apply(void 0,t)},e.prototype.tryParseUnquoted=function(i,t){if(this.isEOF())return null;var r=this.char();return r===60||r===123||r===35&&(t==="plural"||t==="selectordinal")||r===125&&i>0?null:(this.bump(),Yt(r))},e.prototype.parseArgument=function(i,t){var r=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(w.EXPECT_ARGUMENT_CLOSING_BRACE,T(r,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(w.EMPTY_ARGUMENT,T(r,this.clonePosition()));var a=this.parseIdentifierIfPossible().value;if(!a)return this.error(w.MALFORMED_ARGUMENT,T(r,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(w.EXPECT_ARGUMENT_CLOSING_BRACE,T(r,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:S.argument,value:a,location:T(r,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(w.EXPECT_ARGUMENT_CLOSING_BRACE,T(r,this.clonePosition())):this.parseArgumentOptions(i,t,a,r);default:return this.error(w.MALFORMED_ARGUMENT,T(r,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var i=this.clonePosition(),t=this.offset(),r=Jt(this.message,t),a=t+r.length;this.bumpTo(a);var n=this.clonePosition(),o=T(i,n);return{value:r,location:o}},e.prototype.parseArgumentOptions=function(i,t,r,a){var n,o=this.clonePosition(),s=this.parseIdentifierIfPossible().value,c=this.clonePosition();switch(s){case"":return this.error(w.EXPECT_ARGUMENT_TYPE,T(o,c));case"number":case"date":case"time":{this.bumpSpace();var u=null;if(this.bumpIf(",")){this.bumpSpace();var g=this.clonePosition(),m=this.parseSimpleArgStyleIfPossible();if(m.err)return m;var f=Hn(m.val);if(f.length===0)return this.error(w.EXPECT_ARGUMENT_STYLE,T(this.clonePosition(),this.clonePosition()));var v=T(g,this.clonePosition());u={style:f,styleLocation:v}}var y=this.tryParseArgumentClose(a);if(y.err)return y;var E=T(a,this.clonePosition());if(u&&Wi(u?.style,"::",0)){var P=Bn(u.style.slice(2));if(s==="number"){var m=this.parseNumberSkeletonFromString(P,u.styleLocation);return m.err?m:{val:{type:S.number,value:r,location:E,style:m.val},err:null}}else{if(P.length===0)return this.error(w.EXPECT_DATE_TIME_SKELETON,E);var q=P;this.locale&&(q=Vi(P,this.locale));var f={type:pe.dateTime,pattern:q,location:u.styleLocation,parsedOptions:this.shouldParseSkeletons?Ni(q):{}},_e=s==="date"?S.date:S.time;return{val:{type:_e,value:r,location:E,style:f},err:null}}}return{val:{type:s==="number"?S.number:s==="date"?S.date:S.time,value:r,location:E,style:(n=u?.style)!==null&&n!==void 0?n:null},err:null}}case"plural":case"selectordinal":case"select":{var F=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(w.EXPECT_SELECT_ARGUMENT_OPTIONS,T(F,k({},F)));this.bumpSpace();var Te=this.parseIdentifierIfPossible(),ne=0;if(s!=="select"&&Te.value==="offset"){if(!this.bumpIf(":"))return this.error(w.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,T(this.clonePosition(),this.clonePosition()));this.bumpSpace();var m=this.tryParseDecimalInteger(w.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,w.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(m.err)return m;this.bumpSpace(),Te=this.parseIdentifierIfPossible(),ne=m.val}var Ge=this.tryParsePluralOrSelectOptions(i,s,t,Te);if(Ge.err)return Ge;var y=this.tryParseArgumentClose(a);if(y.err)return y;var pi=T(a,this.clonePosition());return s==="select"?{val:{type:S.select,value:r,options:Zi(Ge.val),location:pi},err:null}:{val:{type:S.plural,value:r,options:Zi(Ge.val),offset:ne,pluralType:s==="plural"?"cardinal":"ordinal",location:pi},err:null}}default:return this.error(w.INVALID_ARGUMENT_TYPE,T(o,c))}},e.prototype.tryParseArgumentClose=function(i){return this.isEOF()||this.char()!==125?this.error(w.EXPECT_ARGUMENT_CLOSING_BRACE,T(i,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var i=0,t=this.clonePosition();!this.isEOF();){var r=this.char();switch(r){case 39:{this.bump();var a=this.clonePosition();if(!this.bumpUntil("'"))return this.error(w.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,T(a,this.clonePosition()));this.bump();break}case 123:{i+=1,this.bump();break}case 125:{if(i>0)i-=1;else return{val:this.message.slice(t.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(t.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(i,t){var r=[];try{r=Fi(i)}catch{return this.error(w.INVALID_NUMBER_SKELETON,t)}return{val:{type:pe.number,tokens:r,location:t,parsedOptions:this.shouldParseSkeletons?ji(r):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(i,t,r,a){for(var n,o=!1,s=[],c=new Set,u=a.value,g=a.location;;){if(u.length===0){var m=this.clonePosition();if(t!=="select"&&this.bumpIf("=")){var f=this.tryParseDecimalInteger(w.EXPECT_PLURAL_ARGUMENT_SELECTOR,w.INVALID_PLURAL_ARGUMENT_SELECTOR);if(f.err)return f;g=T(m,this.clonePosition()),u=this.message.slice(m.offset,this.offset())}else break}if(c.has(u))return this.error(t==="select"?w.DUPLICATE_SELECT_ARGUMENT_SELECTOR:w.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,g);u==="other"&&(o=!0),this.bumpSpace();var v=this.clonePosition();if(!this.bumpIf("{"))return this.error(t==="select"?w.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:w.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,T(this.clonePosition(),this.clonePosition()));var y=this.parseMessage(i+1,t,r);if(y.err)return y;var E=this.tryParseArgumentClose(v);if(E.err)return E;s.push([u,{value:y.val,location:T(v,this.clonePosition())}]),c.add(u),this.bumpSpace(),n=this.parseIdentifierIfPossible(),u=n.value,g=n.location}return s.length===0?this.error(t==="select"?w.EXPECT_SELECT_ARGUMENT_SELECTOR:w.EXPECT_PLURAL_ARGUMENT_SELECTOR,T(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!o?this.error(w.MISSING_OTHER_CLAUSE,T(this.clonePosition(),this.clonePosition())):{val:s,err:null}},e.prototype.tryParseDecimalInteger=function(i,t){var r=1,a=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(r=-1);for(var n=!1,o=0;!this.isEOF();){var s=this.char();if(s>=48&&s<=57)n=!0,o=o*10+(s-48),this.bump();else break}var c=T(a,this.clonePosition());return n?(o*=r,Pn(o)?{val:o,err:null}:this.error(t,c)):this.error(i,c)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var i=this.position.offset;if(i>=this.message.length)throw Error("out of bound");var t=Xi(this.message,i);if(t===void 0)throw Error("Offset ".concat(i," is at invalid UTF-16 code unit boundary"));return t},e.prototype.error=function(i,t){return{val:null,err:{kind:i,message:this.message,location:t}}},e.prototype.bump=function(){if(!this.isEOF()){var i=this.char();i===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=i<65536?1:2)}},e.prototype.bumpIf=function(i){if(Wi(this.message,i,this.offset())){for(var t=0;t<i.length;t++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(i){var t=this.offset(),r=this.message.indexOf(i,t);return r>=0?(this.bumpTo(r),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(i){if(this.offset()>i)throw Error("targetOffset ".concat(i," must be greater than or equal to the current offset ").concat(this.offset()));for(i=Math.min(i,this.message.length);;){var t=this.offset();if(t===i)break;if(t>i)throw Error("targetOffset ".concat(i," is at invalid UTF-16 code unit boundary"));if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&Ki(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var i=this.char(),t=this.offset(),r=this.message.charCodeAt(t+(i>=65536?2:1));return r??null},e})();function Kt(e){return e>=97&&e<=122||e>=65&&e<=90}function On(e){return Kt(e)||e===47}function Fn(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function Ki(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function Mn(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function Qt(e){e.forEach(function(i){if(delete i.location,rt(i)||at(i))for(var t in i.options)delete i.options[t].location,Qt(i.options[t].value);else et(i)&&ot(i.style)||(tt(i)||it(i))&&Ne(i.style)?delete i.style.location:nt(i)&&Qt(i.children)})}function Qi(e,i){i===void 0&&(i={}),i=k({shouldParseSkeletons:!0,requiresOtherClause:!0},i);var t=new Ji(e,i).parse();if(t.err){var r=SyntaxError(w[t.err.kind]);throw r.location=t.err.location,r.originalMessage=t.err.message,r}return i?.captureLocation||Qt(t.val),t.val}function Be(e,i){var t=i&&i.cache?i.cache:Wn,r=i&&i.serializer?i.serializer:qn,a=i&&i.strategy?i.strategy:Gn;return a(e,{cache:t,serializer:r})}function Un(e){return e==null||typeof e=="number"||typeof e=="boolean"}function er(e,i,t,r){var a=Un(r)?r:t(r),n=i.get(a);return typeof n>"u"&&(n=e.call(this,r),i.set(a,n)),n}function tr(e,i,t){var r=Array.prototype.slice.call(arguments,3),a=t(r),n=i.get(a);return typeof n>"u"&&(n=e.apply(this,r),i.set(a,n)),n}function ei(e,i,t,r,a){return t.bind(i,e,r,a)}function Gn(e,i){var t=e.length===1?er:tr;return ei(e,this,t,i.cache.create(),i.serializer)}function jn(e,i){return ei(e,this,tr,i.cache.create(),i.serializer)}function Vn(e,i){return ei(e,this,er,i.cache.create(),i.serializer)}var qn=function(){return JSON.stringify(arguments)};function ti(){this.cache=Object.create(null)}ti.prototype.get=function(e){return this.cache[e]};ti.prototype.set=function(e,i){this.cache[e]=i};var Wn={create:function(){return new ti}},st={variadic:jn,monadic:Vn};var he;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(he||(he={}));var He=(function(e){Le(i,e);function i(t,r,a){var n=e.call(this,t)||this;return n.code=r,n.originalMessage=a,n}return i.prototype.toString=function(){return"[formatjs Error: ".concat(this.code,"] ").concat(this.message)},i})(Error);var ii=(function(e){Le(i,e);function i(t,r,a,n){return e.call(this,'Invalid values for "'.concat(t,'": "').concat(r,'". Options are "').concat(Object.keys(a).join('", "'),'"'),he.INVALID_VALUE,n)||this}return i})(He);var ir=(function(e){Le(i,e);function i(t,r,a){return e.call(this,'Value for "'.concat(t,'" must be of type ').concat(r),he.INVALID_VALUE,a)||this}return i})(He);var rr=(function(e){Le(i,e);function i(t,r){return e.call(this,'The intl string context variable "'.concat(t,'" was not provided to the string "').concat(r,'"'),he.MISSING_VALUE,r)||this}return i})(He);var L;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(L||(L={}));function Zn(e){return e.length<2?e:e.reduce(function(i,t){var r=i[i.length-1];return!r||r.type!==L.literal||t.type!==L.literal?i.push(t):r.value+=t.value,i},[])}function Xn(e){return typeof e=="function"}function Oe(e,i,t,r,a,n,o){if(e.length===1&&Vt(e[0]))return[{type:L.literal,value:e[0].value}];for(var s=[],c=0,u=e;c<u.length;c++){var g=u[c];if(Vt(g)){s.push({type:L.literal,value:g.value});continue}if(Li(g)){typeof n=="number"&&s.push({type:L.literal,value:t.getNumberFormat(i).format(n)});continue}var m=g.value;if(!(a&&m in a))throw new rr(m,o);var f=a[m];if(Ri(g)){(!f||typeof f=="string"||typeof f=="number")&&(f=typeof f=="string"||typeof f=="number"?String(f):""),s.push({type:typeof f=="string"?L.literal:L.object,value:f});continue}if(tt(g)){var v=typeof g.style=="string"?r.date[g.style]:Ne(g.style)?g.style.parsedOptions:void 0;s.push({type:L.literal,value:t.getDateTimeFormat(i,v).format(f)});continue}if(it(g)){var v=typeof g.style=="string"?r.time[g.style]:Ne(g.style)?g.style.parsedOptions:r.time.medium;s.push({type:L.literal,value:t.getDateTimeFormat(i,v).format(f)});continue}if(et(g)){var v=typeof g.style=="string"?r.number[g.style]:ot(g.style)?g.style.parsedOptions:void 0;v&&v.scale&&(f=f*(v.scale||1)),s.push({type:L.literal,value:t.getNumberFormat(i,v).format(f)});continue}if(nt(g)){var y=g.children,E=g.value,P=a[E];if(!Xn(P))throw new ir(E,"function",o);var q=Oe(y,i,t,r,a,n),_e=P(q.map(function(ne){return ne.value}));Array.isArray(_e)||(_e=[_e]),s.push.apply(s,_e.map(function(ne){return{type:typeof ne=="string"?L.literal:L.object,value:ne}}))}if(rt(g)){var F=g.options[f]||g.options.other;if(!F)throw new ii(g.value,f,Object.keys(g.options),o);s.push.apply(s,Oe(F.value,i,t,r,a));continue}if(at(g)){var F=g.options["=".concat(f)];if(!F){if(!Intl.PluralRules)throw new He(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,he.MISSING_INTL_API,o);var Te=t.getPluralRules(i,{type:g.pluralType}).select(f-(g.offset||0));F=g.options[Te]||g.options.other}if(!F)throw new ii(g.value,f,Object.keys(g.options),o);s.push.apply(s,Oe(F.value,i,t,r,a,f-(g.offset||0)));continue}}return Zn(s)}function Yn(e,i){return i?k(k(k({},e||{}),i||{}),Object.keys(e).reduce(function(t,r){return t[r]=k(k({},e[r]),i[r]||{}),t},{})):e}function Jn(e,i){return i?Object.keys(e).reduce(function(t,r){return t[r]=Yn(e[r],i[r]),t},k({},e)):e}function ri(e){return{create:function(){return{get:function(i){return e[i]},set:function(i,t){e[i]=t}}}}}function Kn(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:Be(function(){for(var i,t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];return new((i=Intl.NumberFormat).bind.apply(i,Qe([void 0],t,!1)))},{cache:ri(e.number),strategy:st.variadic}),getDateTimeFormat:Be(function(){for(var i,t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];return new((i=Intl.DateTimeFormat).bind.apply(i,Qe([void 0],t,!1)))},{cache:ri(e.dateTime),strategy:st.variadic}),getPluralRules:Be(function(){for(var i,t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];return new((i=Intl.PluralRules).bind.apply(i,Qe([void 0],t,!1)))},{cache:ri(e.pluralRules),strategy:st.variadic})}}var ar=(function(){function e(i,t,r,a){var n=this;if(t===void 0&&(t=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(o){var s=n.formatToParts(o);if(s.length===1)return s[0].value;var c=s.reduce(function(u,g){return!u.length||g.type!==L.literal||typeof u[u.length-1]!="string"?u.push(g.value):u[u.length-1]+=g.value,u},[]);return c.length<=1?c[0]||"":c},this.formatToParts=function(o){return Oe(n.ast,n.locales,n.formatters,n.formats,o,void 0,n.message)},this.resolvedOptions=function(){return{locale:n.resolvedLocale.toString()}},this.getAst=function(){return n.ast},this.locales=t,this.resolvedLocale=e.resolveLocale(t),typeof i=="string"){if(this.message=i,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(i,{ignoreTag:a?.ignoreTag,locale:this.resolvedLocale})}else this.ast=i;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=Jn(e.formats,r),this.formatters=a&&a.formatters||Kn(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.resolveLocale=function(i){var t=Intl.NumberFormat.supportedLocalesOf(i);return t.length>0?new Intl.Locale(t[0]):new Intl.Locale(typeof i=="string"?i:i[0])},e.__parse=Qi,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e})();var nr=ar;var j={en:Pt,de:Bt,es:Ht,fr:Ot,it:Ft,nl:Mt,pl:Ut,"pt-BR":Gt};function Qn(e){let i=e.replace(/['"]+/g,"");if(j[i])return j[i];let t=i.split("-")[0];if(j[t])return j[t];let r=Object.keys(j).find(a=>a.startsWith(t+"-"));return r?j[r]:j.en}function l(e,i,...t){var r;try{r=e.split(".").reduce((n,o)=>n[o],Qn(i))}catch{r=e.split(".").reduce((o,s)=>o[s],j.en)}if(r===void 0&&(r=e.split(".").reduce((n,o)=>n[o],j.en)),!t.length)return r;let a={};for(let n=0;n<t.length;n+=2){let o=t[n];o=o.replace(/^{([^}]+)?}$/,"$1"),a[o]=t[n+1]}try{return new nr(r,i).format(a)}catch(n){return"Translation "+n}}var or=async()=>{await customElements.whenDefined("partial-panel-resolver"),await document.createElement("partial-panel-resolver")._getRoutes([{component_name:"config",url_path:"a"}])?.routes?.a?.load?.(),await customElements.whenDefined("ha-panel-config");let t=document.createElement("ha-panel-config");await t?.routerOptions?.routes?.dashboard?.load?.(),await t?.routerOptions?.routes?.general?.load?.(),await t?.routerOptions?.routes?.entities?.load?.(),await t?.routerOptions?.routes?.labels?.load?.(),await customElements.whenDefined("ha-config-dashboard")};var sr,lr;var cr=function(e,i){return eo(i).format(e)},eo=function(e){return new Intl.DateTimeFormat(e.language,{year:"numeric",month:"numeric",day:"numeric"})};(function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"})(sr||(sr={})),(function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"})(lr||(lr={}));var dr=function(e,i,t,r){r=r||{},t=t??{};var a=new Event(i,{bubbles:r.bubbles===void 0||r.bubbles,cancelable:!!r.cancelable,composed:r.composed===void 0||r.composed});return a.detail=t,e.dispatchEvent(a),a};var $=(e,i)=>{dr(e,"hass-notification",{message:i})};var N=D`
    :host {
        color: var(--primary-text-color);
        background: var(--lovelace-background, var(--primary-background-color));
    }

    .header {
        background-color: var(--app-header-background-color);
        color: var(--app-header-text-color, white);
        border-bottom: var(--app-header-border-bottom, none);
    }

    .toolbar {
        height: var(--header-height);
        display: flex;
        align-items: center;
        font-size: 20px;
        padding: 0 16px;
        font-weight: 400;
        box-sizing: border-box;
    }

    .main-title {
        margin: 0 0 0 24px;
        line-height: 20px;
        flex-grow: 1;
    }

    .view {
        height: calc(100vh - 65px);
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px 16px;
        box-sizing: border-box;
    }

    ha-card {
        display: block;
        margin: 5px;
    }

    ha-expansion-panel {
        --input-fill-color: none;
    }

    .extras-panel{
        margin-bottom: 14px;
    }

    .warning {
        --mdc-theme-primary: var(--error-color);
        color: var(--primary-text-color);
    }

    ha-dialog {
        --mdc-dialog-min-width: 600px;
    }

    @media (max-width: 600px) {
        ha-dialog {
        --mdc-dialog-min-width: auto;
        }
    }
`,ye=D`
        :host {
            /* Status colors, from the theme. */
            --todo-overdue: var(--error-color, #db4437);
            --todo-due-soon: var(--warning-color, #ffa726);
            --todo-upcoming: var(--primary-color, #03a9f4);
            --todo-done: var(--success-color, #43a047);

            --hm-subtle: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
            --hm-hover: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
            --hm-c: var(--todo-upcoming);
        }

        /* Status scopes: --hm-c is the raw status color, --hm-ink the same
           hue pulled toward the text color so it stays legible as text on
           both light and dark themes (plain amber on white is not). */
        .overdue { --hm-c: var(--todo-overdue); }
        .due_soon { --hm-c: var(--todo-due-soon); }
        .upcoming { --hm-c: var(--todo-upcoming); }
        .done { --hm-c: var(--todo-done); }
        .overdue, .due_soon, .upcoming, .done, :host {
            --hm-ink: color-mix(in srgb, var(--hm-c) 78%, var(--primary-text-color));
        }

        button {
            font: inherit;
            color: inherit;
            background: none;
            border: none;
            margin: 0;
            padding: 0;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
        }

        button:focus-visible {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }

        .icon-button {
            flex-shrink: 0;
            display: grid;
            place-items: center;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            color: var(--secondary-text-color);
            transition: background-color 0.15s, color 0.15s;
            --mdc-icon-size: 20px;
        }

        .icon-button:hover {
            background: var(--hm-subtle);
            color: var(--primary-text-color);
        }

        .icon-button.active {
            color: var(--primary-color);
            background: color-mix(in srgb, var(--primary-color) 12%, transparent);
        }

        .icon-button.small {
            width: 28px;
            height: 28px;
            --mdc-icon-size: 18px;
        }

        .chip-badge {
            display: inline-grid;
            place-items: center;
            min-width: 20px;
            height: 20px;
            padding: 0 6px;
            box-sizing: border-box;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 700;
            background: color-mix(in srgb, var(--hm-c) 22%, transparent);
            color: var(--hm-ink);
        }
`;var me=e=>{let[i]=e.split("T"),[t,r,a]=i.split("-").map(Number);return new Date(t,r-1,a)},ge=e=>{let i=e.trigger_type??"time";return i==="time"||i==="date"},Fe=e=>`${e.progress_current??0} / ${e.progress_target??0}`,ct=(e,i,t)=>{let r=e===1?i.slice(0,-1):i;return`${e} ${l(`intervals.${r}`,t)}`},Me=(e,i)=>{let t=e.trigger_type??"time";return t==="count"?l("intervals.every_uses",i,"{value}",String(e.count_threshold??0)):t==="runtime"?l("intervals.every_runtime",i,"{value}",String(e.runtime_threshold??0)):ct(e.interval_value,e.interval_type,i)},dt=(e,i,t)=>{let r=t?new Date(t):new Date;r.setHours(0,0,0,0);let a=null,n=null;ge(e)&&e.next_due&&(a=me(e.next_due),n=Math.round((a.getTime()-r.getTime())/(1e3*60*60*24)));let o;e.due?o="overdue":n!==null&&n<=i?o="due_soon":o="upcoming";let s=!1;return e.last_performed&&(s=me(e.last_performed).getTime()===r.getTime()),{nextDue:a,daysUntilDue:n,status:o,completedToday:s}},ai=(e,i,t)=>{if(e.due)return 1;let r=s=>Math.min(Math.max(s,0),1);if(!ge(e)){let s=e.progress_target??0;return s>0?r((e.progress_current??0)/s):0}if(!i.nextDue||!e.last_performed)return 0;let a=t?new Date(t):new Date;a.setHours(0,0,0,0);let n=me(e.last_performed).getTime(),o=i.nextDue.getTime()-n;return o<=0?1:r((a.getTime()-n)/o)},ur=(e,i,t)=>{if(!ge(i))return Fe(i);let r=e.daysUntilDue;return r===null?"":r===0?l("panel.list.due_today",t):r<0?l("panel.list.days_overdue",t,"{count}",Math.abs(r)):l("panel.list.days_left",t,"{count}",r)},ut=(e,i,t,r)=>{let a=t.trim().toLowerCase();if(!a&&!r.length)return e;let n=new Map;return r.length&&i.forEach(o=>n.set(o.unique_id,o.labels)),e.filter(o=>{if(a&&!`${o.title}
${o.description??""}
${o.group_id??""}`.toLowerCase().includes(a))return!1;if(r.length){let s=n.get(o.id)??[];if(!r.some(c=>s.includes(c)))return!1}return!0})},Ue=e=>e.completedToday&&e.status!=="overdue"?"done":e.status,pt=(e,i)=>{let t=new Map;return e.forEach(r=>{let a=Ue(r);if(a!=="overdue"&&a!=="due_soon")return;let n=i(r),o=t.get(n);o?(o.count+=1,a==="overdue"&&(o.status="overdue")):t.set(n,{count:1,status:a})}),t},ni=(e,i,t)=>{let r=new Intl.Collator(t),a=(o,s)=>o.nextDue&&s.nextDue?o.nextDue.getTime()-s.nextDue.getTime():o.nextDue?-1:s.nextDue?1:r.compare(i(o),i(s)),n={overdue:[],dueSoon:[],upcoming:[],done:[]};return e.forEach(o=>{let s=Ue(o);s==="overdue"?n.overdue.push(o):s==="due_soon"?n.dueSoon.push(o):s==="done"?n.done.push(o):n.upcoming.push(o)}),n.overdue.sort(a),n.dueSoon.sort(a),n.upcoming.sort(a),n.done.sort(a),n},pr=(e,i,t,r)=>{let a=new Map;e.forEach(s=>{let c=i(s),u=a.get(c);u?u.push(s):a.set(c,[s])});let n=new Intl.Collator(r);return[...a.keys()].sort((s,c)=>s===""?1:c===""?-1:n.compare(s,c)).map(s=>{let c=ni(a.get(s),t,r);return{group:s,tasks:[...c.overdue,...c.dueSoon,...c.upcoming,...c.done]}})},lt=class{constructor(i,t){this._fn=i;this._ms=t}schedule(){this.cancel(),this._timer=setTimeout(()=>{this._timer=void 0,this._fn()},this._ms)}cancel(){this._timer!==void 0&&clearTimeout(this._timer),this._timer=void 0}};var ht=["days","weeks","months","years"];var hr=500;function mr(e){return{days:l("intervals.days",e),weeks:l("intervals.weeks",e),months:l("intervals.months",e),years:l("intervals.years",e)}}var to=["title","description","interval_value","interval_type","last_performed","icon","group_id"],gr=e=>{let i=[],t=[],r="",a=!1,n=0,o=()=>{t.push(r),r=""},s=()=>{o(),t.some(c=>c.trim()!=="")&&i.push(t),t=[]};for(;n<e.length;){let c=e[n];if(a){if(c==='"'){if(e[n+1]==='"'){r+='"',n+=2;continue}a=!1,n+=1;continue}r+=c,n+=1;continue}if(c==='"'&&r===""){a=!0,n+=1;continue}if(c===","){o(),n+=1;continue}if(c===`
`||c==="\r"){c==="\r"&&e[n+1]===`
`&&(n+=1),s(),n+=1;continue}r+=c,n+=1}return(r!==""||t.length)&&s(),i},io=/^\d{4}-\d{2}-\d{2}$/,fr=e=>{if(!e.length)return{tasks:[],errors:["The file is empty."]};let i=e[0].map(a=>a.trim().toLowerCase());if(!i.includes("title"))return{tasks:[],errors:['The header row must include a "title" column.']};let t=[],r=[];return e.slice(1).forEach((a,n)=>{let o=n+2,s=y=>{let E=i.indexOf(y);return E>=0?(a[E]??"").trim():""},c=s("title");if(!c){r.push(`Line ${o}: missing title.`);return}let u=s("interval_value"),g=u===""?30:Number(u);if(!Number.isFinite(g)||g<1){r.push(`Line ${o}: invalid interval_value "${u}".`);return}let m=s("interval_type").toLowerCase(),f=m===""?"days":m;if(!ht.includes(f)){r.push(`Line ${o}: invalid interval_type "${m}".`);return}let v=s("last_performed");if(v&&!io.test(v)){r.push(`Line ${o}: last_performed must be YYYY-MM-DD.`);return}t.push({title:c,description:s("description")||void 0,interval_value:Math.floor(g),interval_type:f,last_performed:v||void 0,icon:s("icon")||void 0,group_id:s("group_id")||void 0})}),{tasks:t,errors:r}},ro=e=>{let i=/^[=+\-@\t]/.test(e)?`'${e}`:e;return/[",\n\r]/.test(i)?`"${i.replace(/"/g,'""')}"`:i},_r=e=>{let i=[to.join(",")];return e.forEach(t=>{i.push([t.title,t.description??"",String(t.interval_value),t.interval_type,t.last_performed?t.last_performed.split("T")[0]:"",t.icon??"",t.group_id??""].map(ro).join(","))}),i.join(`\r
`)+`\r
`};var mt=e=>Object.keys(e.services?.notify??{}).filter(i=>i!=="notify").map(i=>`notify.${i}`).sort((i,t)=>i.localeCompare(t)),B=e=>customElements.get("ha-dialog-footer")?d`<ha-dialog-footer slot="footer">${e}</ha-dialog-footer>`:e,gt=(e,i,t,r=a=>cr(a,t))=>e?.length?d`
        <ul class="history-list">
            ${e.slice(-i).reverse().map(a=>d`
                <li>
                    ${r(me(a.performed))}${a.note?d` — <span class="history-note">${a.note}</span>`:_}
                </li>
            `)}
        </ul>
    `:_,ft=D`
    .history-list {
        margin: 0;
        padding-left: 18px;
        font-size: 14px;
    }

    /* Wrap a long (uncapped) history list so the dialog doesn't grow. */
    .history-scroll {
        max-height: 180px;
        overflow-y: auto;
    }

    .history-list li {
        margin: 2px 0;
    }

    .history-note {
        color: var(--secondary-text-color);
    }
`;var vr=e=>e.callWS({type:"config/entity_registry/list"}),yr=e=>e.callWS({type:"config/label_registry/list"}),br=e=>e.callWS({type:"tasks/get_tasks"}),xr=(e,i)=>e.callWS({type:"tasks/get_task",task_id:i}),_t=(e,i)=>e.callWS({type:"tasks/add_task",...i}),wr=(e,i)=>e.callWS({type:"tasks/remove_task",task_id:i}),kr=(e,i,t)=>e.callWS({type:"tasks/complete_task",task_id:i,...t?{note:t}:{}}),vt=(e,i)=>e.callWS({type:"tasks/update_task",...i}),Tr=e=>e.callWS({type:"tasks/get_groups"}),Er=(e,i)=>e.callWS({type:"tasks/create_group",group_id:i}),Sr=(e,i,t)=>e.callWS({type:"tasks/rename_group",old_group_id:i,new_group_id:t}),Ar=(e,i)=>e.callWS({type:"tasks/delete_group",group_id:i}),$r=e=>e.callWS({type:"tasks/get_config"}),Cr=(e,i)=>e.connection.subscribeMessage(i,{type:"tasks/subscribe_updates"});var Dr={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},zr=e=>(...i)=>({_$litDirective$:e,values:i}),yt=class{constructor(i){}get _$AU(){return this._$AM._$AU}_$AT(i,t,r){this._$Ct=i,this._$AM=t,this._$Ci=r}_$AS(i,t){return this.update(i,t)}update(i,t){return this.render(...t)}};var{I:ao}=zi,Ir=e=>e;var Rr=()=>document.createComment(""),be=(e,i,t)=>{let r=e._$AA.parentNode,a=i===void 0?e._$AB:i._$AA;if(t===void 0){let n=r.insertBefore(Rr(),a),o=r.insertBefore(Rr(),a);t=new ao(n,o,e,e.options)}else{let n=t._$AB.nextSibling,o=t._$AM,s=o!==e;if(s){let c;t._$AQ?.(e),t._$AM=e,t._$AP!==void 0&&(c=e._$AU)!==o._$AU&&t._$AP(c)}if(n!==a||s){let c=t._$AA;for(;c!==n;){let u=Ir(c).nextSibling;Ir(r).insertBefore(c,a),c=u}}}return t},re=(e,i,t=e)=>(e._$AI(i,t),e),no={},Lr=(e,i=no)=>e._$AH=i,Nr=e=>e._$AH,bt=e=>{e._$AR(),e._$AA.remove()};var Pr=(e,i,t)=>{let r=new Map;for(let a=i;a<=t;a++)r.set(e[a],a);return r},oi=zr(class extends yt{constructor(e){if(super(e),e.type!==Dr.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,i,t){let r;t===void 0?t=i:i!==void 0&&(r=i);let a=[],n=[],o=0;for(let s of e)a[o]=r?r(s,o):o,n[o]=t(s,o),o++;return{values:n,keys:a}}render(e,i,t){return this.dt(e,i,t).values}update(e,[i,t,r]){let a=Nr(e),{values:n,keys:o}=this.dt(i,t,r);if(!Array.isArray(a))return this.ut=o,n;let s=this.ut??(this.ut=[]),c=[],u,g,m=0,f=a.length-1,v=0,y=n.length-1;for(;m<=f&&v<=y;)if(a[m]===null)m++;else if(a[f]===null)f--;else if(s[m]===o[v])c[v]=re(a[m],n[v]),m++,v++;else if(s[f]===o[y])c[y]=re(a[f],n[y]),f--,y--;else if(s[m]===o[y])c[y]=re(a[m],n[y]),be(e,c[y+1],a[m]),m++,y--;else if(s[f]===o[v])c[v]=re(a[f],n[v]),be(e,a[m],a[f]),f--,v++;else if(u===void 0&&(u=Pr(o,v,y),g=Pr(s,m,f)),u.has(s[m]))if(u.has(s[f])){let E=g.get(o[v]),P=E!==void 0?a[E]:null;if(P===null){let q=be(e,a[m]);re(q,n[v]),c[v]=q}else c[v]=re(P,n[v]),be(e,a[m],P),a[E]=null;v++}else bt(a[f]),f--;else bt(a[m]),m++;for(;v<=y;){let E=be(e,c[y+1]);re(E,n[v]),c[v++]=E}for(;m<=f;){let E=a[m++];E!==null&&bt(E)}return this.ut=o,Lr(e,c),G}});var oo=(e,i)=>{let t=e.language,r=ge(i),a=r?Me(i,t):Fe(i);return{heading:l("panel.dialog.confirm_complete.title",t),message:l(r?"panel.dialog.confirm_complete.message":"panel.dialog.confirm_complete.message_progress",t,"{title}",i.title,"{interval}",a),confirmLabel:l("panel.dialog.confirm_complete.actions.confirm",t),cancelLabel:l("common.cancel",t),input:{label:l("panel.dialog.confirm_complete.note_label",t)},onConfirm:()=>{}}},Br=(e,i,t,r,a=n=>n())=>{let n=t.language;i?.open({...oo(t,r),onConfirm:o=>a(async()=>{try{await kr(t,r.id,o),$(e,l("panel.cards.current.alerts.complete_success",n,"{title}",r.title))}catch(s){console.error("Failed to complete task:",s),$(e,l("panel.cards.current.alerts.complete_error",n))}})})},Hr=(e,i,t,r,a)=>{let n=t.language;i?.open({heading:l("panel.dialog.confirm_remove.title",n),message:l("panel.dialog.confirm_remove.message",n,"{title}",r?.title??""),confirmLabel:l("panel.dialog.confirm_remove.actions.confirm",n),cancelLabel:l("common.cancel",n),destructive:!0,onConfirm:async()=>{try{await wr(t,a)}catch(o){console.error("Failed to remove task:",o),$(e,l("panel.cards.current.alerts.remove_error",n))}}})};var xe=class extends A{constructor(){super(...arguments);this._opts=null}open(t){this._opts=t}_close(){this._opts=null}_handleConfirm(){let t=this._opts?.onConfirm,r=this._input?.value.trim()||void 0;this._close(),t?.(r)}_renderButtons(){return d`
            <ha-button
                data-dialog="close"
                appearance="plain"
                slot="secondaryAction"
                @click=${this._close}
            >
                ${this._opts.cancelLabel}
            </ha-button>
            <ha-button
                slot="primaryAction"
                class="${this._opts.destructive?"warning":""}"
                @click=${this._handleConfirm}
            >
                ${this._opts.confirmLabel}
            </ha-button>
        `}render(){return this._opts?d`
            <ha-dialog
                open
                heading="${this._opts.heading}"
                header-title="${this._opts.heading}"
                @closed=${this._close}
            >
                <p>${this._opts.message}</p>

                ${this._opts.input?d`
                    <label class="confirm-input-label">
                        ${this._opts.input.label}
                        <input
                            class="confirm-input"
                            type="text"
                            maxlength=${hr}
                            placeholder=${this._opts.input.placeholder??""}
                        />
                    </label>
                `:_}

                ${B(this._renderButtons())}
            </ha-dialog>
        `:d``}};xe.styles=[N,D`
        .confirm-input-label {
            display: block;
            font-size: 12px;
            font-weight: 500;
            color: var(--secondary-text-color);
        }

        .confirm-input {
            display: block;
            width: 100%;
            box-sizing: border-box;
            margin-top: 4px;
            padding: 8px 10px;
            font-size: 14px;
            color: var(--primary-text-color);
            background: var(--secondary-background-color);
            border: 1px solid var(--divider-color);
            border-radius: 8px;
            outline: none;
        }
    `],h([b()],xe.prototype,"_opts",2),h([R(".confirm-input")],xe.prototype,"_input",2);customElements.get("hm-confirm-dialog")||customElements.define("hm-confirm-dialog",xe);var so=3,si=[{bucket:"overdue",key:"overdue",label:"panel.list.overdue",icon:"mdi:alert-circle-outline"},{bucket:"due_soon",key:"dueSoon",label:"panel.list.due_soon",icon:"mdi:clock-alert-outline"},{bucket:"upcoming",key:"upcoming",label:"panel.list.upcoming",icon:"mdi:calendar-check-outline"},{bucket:"done",key:"done",label:"panel.list.done_today",icon:"mdi:check-circle-outline"}],Or={time:"mdi:calendar-refresh",date:"mdi:calendar-star",count:"mdi:counter",runtime:"mdi:timer-cog-outline"},ci=17,Fr=2*Math.PI*ci,li=e=>e.raw.group_id?.trim()||"",Mr=e=>e.raw.title,lo=e=>e&&/^[a-z-]+$/.test(e)?`var(--${e}-color)`:e,C=class extends A{constructor(){super(...arguments);this.tasks=[];this.groups=[];this.heading="";this.dueSoonDays=14;this.searchMode="toggle";this.showGroupChips=!0;this.groupFilter=null;this.groupBy="status";this.readonly=!1;this._completing=new Set;this._expandedTasks=new Set;this._collapsed=new Set;this._searchQuery="";this._searchOpen=!1;this._statusFilter="";this._formatDate=t=>{let r=this.hass?.locale?.language??this.hass?.language??"en";if(this._dateFormats?.lang!==r){let n=r;try{new Intl.DateTimeFormat(n)}catch{n=void 0}this._dateFormats={lang:r,short:new Intl.DateTimeFormat(n,{month:"short",day:"numeric"}),withYear:new Intl.DateTimeFormat(n,{month:"short",day:"numeric",year:"numeric"})}}return(t.getFullYear()===new Date().getFullYear()?this._dateFormats.short:this._dateFormats.withYear).format(t)}}get _hasUngrouped(){return this.tasks.some(t=>!t.group_id?.trim())}get _activeGroup(){let t=this.groupFilter;return t===null?null:t===""?this._hasUngrouped?"":null:this.groups.includes(t)?t:null}get _view(){let t=this.hass?.language??"en",r=[this.tasks,this.groups,this._searchQuery,this.groupFilter,this._statusFilter,this.dueSoonDays,this.groupBy,t],a=this._viewCache;if(a&&a.deps.every((v,y)=>v===r[y]))return a.view;let n=ut(this.tasks,[],this._searchQuery,[]).map(v=>({raw:v,...dt(v,this.dueSoonDays)})),o=pt(n,li),s=this._activeGroup,c=s===null?n:n.filter(v=>li(v)===s),u=ni(c,Mr,t),g={overdue:u.overdue.length,due_soon:u.dueSoon.length,upcoming:u.upcoming.length,done:u.done.length},m;if(this.groupBy==="group"){let v=this._statusFilter?c.filter(y=>Ue(y)===this._statusFilter):c;m=pr(v,li,Mr,t).map(({group:y,tasks:E})=>({key:`group:${y}`,tone:"group",label:y||l("common.ungrouped",t),tasks:E,attention:o.get(y)}))}else{let v=u;if(this._statusFilter){let y=si.find(E=>E.bucket===this._statusFilter).key;v={overdue:[],dueSoon:[],upcoming:[],done:[],[y]:u[y]}}m=si.map(({bucket:y,key:E,label:P})=>({key:`status:${y}`,tone:y,label:l(P,t),tasks:v[E]})).filter(y=>y.tasks.length>0)}let f={counts:g,sections:m,groupAttention:o};return this._viewCache={deps:r,view:f},f}_fire(t,r){this.dispatchEvent(new CustomEvent(t,{detail:r,bubbles:!0,composed:!0}))}_completeTask(t){this._completing.has(t.id)||Br(this,this._confirmDialog,this.hass,t,async r=>{this._completing=new Set(this._completing).add(t.id);try{await r()}finally{let a=new Set(this._completing);a.delete(t.id),this._completing=a}})}_removeTask(t){let r=this.tasks.find(a=>a.id===t);Hr(this,this._confirmDialog,this.hass,r,t)}_toggleExpand(t){let r=new Set(this._expandedTasks);r.has(t)?r.delete(t):r.add(t),this._expandedTasks=r}_toggleSection(t){let r=new Set(this._collapsed);r.has(t)?r.delete(t):r.add(t),this._collapsed=r}_toggleStatusFilter(t){this._statusFilter=this._statusFilter===t?"":t;let r=`status:${t}`;if(this._collapsed.has(r)){let a=new Set(this._collapsed);a.delete(r),this._collapsed=a}}_setGroupFilter(t){this.groupFilter=t,this._fire("group-filter-changed",{group:t})}_setGroupBy(t){this.groupBy!==t&&(this.groupBy=t,this._fire("group-by-changed",{groupBy:t}))}async _toggleSearch(){if(this._searchOpen){this._searchOpen=!1,this._searchQuery="";return}this._searchOpen=!0,await this.updateComplete,this._searchInput?.focus()}_onSearchKeydown(t){t.key==="Escape"&&(this._searchQuery="",this.searchMode==="toggle"&&(this._searchOpen=!1))}render(){if(!this.hass)return d``;let t=this.hass.language,r=this._view,a=this.searchMode==="toggle"&&(this._searchOpen||!!this._searchQuery),n=this.showGroupChips&&this.groups.length>0,o=r.sections.reduce((s,c)=>s+c.tasks.length,0);return d`
            ${this._renderHeader(r.counts,a)}
            ${a?d`<div class="search-row">${this._renderSearchField()}</div>`:_}
            ${this._renderSummary(r.counts)}
            ${n?this._renderGroupChips(r):_}
            ${this._renderToolbar()}

            <div class="task-list">
                ${oi(r.sections,s=>s.key,s=>this._renderSection(s))}

                ${o===0?d`
                    <div class="empty">
                        <ha-icon icon="mdi:clipboard-check-outline"></ha-icon>
                        <span>${l("panel.list.no_tasks",t)}</span>
                    </div>
                `:_}
            </div>

            <hm-confirm-dialog></hm-confirm-dialog>
        `}_renderHeader(t,r){let a=this.hass.language,n=t.overdue+t.due_soon,o=t.overdue?"overdue":t.due_soon?"due_soon":"done";return d`
            <div class="header">
                <div class="header-icon ${o}">
                    <ha-icon icon=${n?"mdi:clipboard-text-clock-outline":"mdi:check-decagram-outline"}></ha-icon>
                </div>
                <div class="header-text">
                    <div class="title">${this.heading}</div>
                    <div class="subtitle ${o}">
                        ${n?l("panel.list.needs_attention",a,"{count}",n):l("panel.list.all_caught_up",a)}
                    </div>
                </div>
                ${this.searchMode==="header"?d`
                    <div class="header-search">${this._renderSearchField()}</div>
                `:d`
                    <button
                        class="icon-button ${r?"active":""}"
                        @click=${this._toggleSearch}
                        title=${l("panel.list.search",a)}
                        aria-label=${l("panel.list.search",a)}
                        aria-pressed=${r?"true":"false"}
                    >
                        <ha-icon icon="mdi:magnify"></ha-icon>
                    </button>
                `}
            </div>
        `}_renderSearchField(){let t=this.hass.language;return d`
            <div class="search">
                <ha-icon icon="mdi:magnify"></ha-icon>
                <input
                    type="search"
                    .value=${this._searchQuery}
                    @input=${r=>this._searchQuery=r.target.value}
                    @keydown=${this._onSearchKeydown}
                    placeholder=${l("panel.list.search",t)}
                    aria-label=${l("panel.list.search",t)}
                />
                ${this._searchQuery?d`
                    <button
                        class="icon-button small"
                        @click=${()=>{this._searchQuery="",this._searchInput?.focus()}}
                        title=${l("panel.list.clear_search",t)}
                        aria-label=${l("panel.list.clear_search",t)}
                    >
                        <ha-icon icon="mdi:close"></ha-icon>
                    </button>
                `:_}
            </div>
        `}_renderSummary(t){let r=this.hass.language;return d`
            <div class="summary ${this._statusFilter?"filtering":""}">
                ${si.slice(0,3).map(({bucket:a,label:n,icon:o})=>{let s=t[a],c=this._statusFilter===a;return d`
                        <button
                            class="tile ${a} ${s===0?"zero":""} ${c?"active":""}"
                            aria-pressed=${c?"true":"false"}
                            @click=${()=>this._toggleStatusFilter(a)}
                        >
                            <ha-icon icon=${o}></ha-icon>
                            <span class="tile-count">${s}</span>
                            <span class="tile-label">${l(n,r)}</span>
                        </button>
                    `})}
            </div>
        `}_renderGroupChips(t){let r=this.hass.language,a=this._activeGroup,n=(o,s)=>{let c=a===o,u=o===null?void 0:t.groupAttention.get(o);return d`
                <button
                    class="chip ${c?"selected":""}"
                    aria-pressed=${c?"true":"false"}
                    @click=${()=>this._setGroupFilter(c?null:o)}
                >
                    ${s}
                    ${u?d`
                        <span class="chip-badge ${u.status}">${u.count}</span>
                    `:_}
                </button>
            `};return d`
            <div class="chips" role="group">
                ${n(null,l("panel.list.all_groups",r))}
                ${this.groups.map(o=>n(o,o))}
                ${this._hasUngrouped?n("",l("common.ungrouped",r)):_}
            </div>
        `}_renderToolbar(){let t=this.hass.language,r=(a,n)=>d`
            <button
                class=${this.groupBy===a?"selected":""}
                aria-pressed=${this.groupBy===a?"true":"false"}
                @click=${()=>this._setGroupBy(a)}
            >${n}</button>
        `;return d`
            <div class="list-toolbar">
                <slot name="filters"></slot>
                <div class="segmented" role="group" aria-label=${l("panel.list.group_by",t)}>
                    <span class="segmented-label">${l("panel.list.group_by",t)}</span>
                    ${r("status",l("panel.list.by_status",t))}
                    ${r("group",l("panel.dialog.move_task.fields.group_id.heading",t))}
                </div>
            </div>
        `}_renderSection(t){let r=this._collapsed.has(t.key);return d`
            <section class="section ${t.tone}">
                <button
                    class="section-header"
                    aria-expanded=${r?"false":"true"}
                    @click=${()=>this._toggleSection(t.key)}
                >
                    <span class="section-title">${t.label}</span>
                    <span class="section-count">${t.tasks.length}</span>
                    ${t.attention?d`
                        <span class="chip-badge ${t.attention.status}">${t.attention.count}</span>
                    `:_}
                    <span class="section-rule"></span>
                    <ha-icon class="chevron ${r?"collapsed":""}" icon="mdi:chevron-down"></ha-icon>
                </button>
                ${r?_:d`
                    <div class="rows">
                        ${oi(t.tasks,a=>a.raw.id,a=>this._renderRow(a))}
                    </div>
                `}
            </section>
        `}_renderRow(t){let r=t.raw,a=this.hass.language,n=Ue(t),o=n==="done",s=this._expandedTasks.has(r.id),c=this._completing.has(r.id),u=!!r.group_id&&this._activeGroup===null&&this.groupBy!=="group",g=o?l("panel.list.done",a):ur(t,r,a),m;return o&&t.nextDue?m=l("panel.list.next_due",a,"{date}",this._formatDate(t.nextDue)):!o&&t.nextDue&&(m=this._formatDate(t.nextDue)),d`
            <div class="row ${n} ${s?"expanded":""} ${c?"completing":""}">
                <button
                    class="row-main"
                    aria-expanded=${s?"true":"false"}
                    @click=${()=>this._toggleExpand(r.id)}
                >
                    ${this._renderRing(t,n)}
                    <span class="row-text">
                        <span class="row-title">${r.title}</span>
                        <span class="row-meta">
                            <!-- Narrow layouts show the due pill here instead of in .row-due. -->
                            <span class="pill meta-due">${g}</span>
                            ${u?d`
                                <span class="meta-item meta-group">
                                    <ha-icon icon="mdi:folder-outline"></ha-icon>
                                    <span class="meta-text">${r.group_id}</span>
                                </span>
                            `:_}
                            <span class="meta-item meta-interval">
                                <ha-icon icon="mdi:repeat"></ha-icon>${Me(r,a)}
                            </span>
                        </span>
                    </span>
                    <span class="row-due">
                        <span class="pill">${g}</span>
                        ${m?d`<span class="due-date">${m}</span>`:_}
                    </span>
                </button>
                <button
                    class="check"
                    @click=${()=>this._completeTask(r)}
                    ?disabled=${c||o}
                    title=${l(o?"panel.list.done":"panel.list.complete",a)}
                    aria-label=${`${l(o?"panel.list.done":"panel.list.complete",a)}: ${r.title}`}
                >
                    <ha-icon icon="mdi:check-bold"></ha-icon>
                </button>
                ${s?this._renderDetails(t):_}
            </div>
        `}_renderRing(t,r){let a=r==="done"?1:ai(t.raw,t),n=t.raw.icon||Or[t.raw.trigger_type??"time"]||Or.time;return d`
            <span class="ring">
                <svg viewBox="0 0 40 40" aria-hidden="true">
                    <circle class="ring-track" cx="20" cy="20" r=${ci}></circle>
                    ${a>.02?$i`
                        <circle
                            class="ring-arc"
                            cx="20" cy="20" r=${ci}
                            stroke-dasharray=${Fr}
                            stroke-dashoffset=${Fr*(1-a)}
                        ></circle>
                    `:_}
                </svg>
                <ha-icon .icon=${n}></ha-icon>
            </span>
        `}_renderDetails(t){let r=t.raw,a=this.hass.language,n=ge(r),o=ai(r,t),s=r.area_id?this.hass.areas?.[r.area_id]?.name:void 0,c=this.labelsByTask?.get(r.id)??[];return d`
            <div class="details">
                ${r.description?d`<p class="description">${r.description}</p>`:_}

                <div class="facts">
                    <div class="fact">
                        <span class="fact-label">${l("panel.list.last_performed",a)}</span>
                        <span class="fact-value">
                            ${r.last_performed?this._formatDate(me(r.last_performed)):"\u2014"}
                        </span>
                    </div>
                    ${n?d`
                        <div class="fact">
                            <span class="fact-label">${l("panel.cards.current.next",a)}</span>
                            <span class="fact-value">${t.nextDue?this._formatDate(t.nextDue):"\u2014"}</span>
                        </div>
                    `:d`
                        <div class="fact">
                            <span class="fact-label">${l("panel.list.progress",a)}</span>
                            <span class="fact-value">${Fe(r)}</span>
                            <span class="bar"><span style="width: ${Math.round(o*100)}%"></span></span>
                        </div>
                    `}
                    <div class="fact">
                        <span class="fact-label">${l("panel.list.repeats",a)}</span>
                        <span class="fact-value">${Me(r,a)}</span>
                    </div>
                    ${s?d`
                        <div class="fact">
                            <span class="fact-label">${l("panel.cards.new.fields.area.heading",a)}</span>
                            <span class="fact-value">${s}</span>
                        </div>
                    `:_}
                    ${c.length?d`
                        <div class="fact">
                            <span class="fact-label">${l("panel.cards.new.fields.label.heading",a)}</span>
                            <span class="fact-value fact-labels">
                                ${c.map(u=>d`
                                    <span class="label-chip" style=${`--label-color: ${lo(u.color)??"var(--primary-color)"}`}>
                                        ${u.icon?d`<ha-icon .icon=${u.icon}></ha-icon>`:_}${u.name}
                                    </span>
                                `)}
                            </span>
                        </div>
                    `:_}
                </div>

                ${r.history?.length?d`
                    <div class="history">
                        <span class="fact-label">${l("panel.list.history",a)}</span>
                        ${gt(r.history,so,this.hass.locale,this._formatDate)}
                    </div>
                `:_}

                ${this.readonly?_:d`
                    <div class="details-actions">
                        <button class="action-button" @click=${()=>this._fire("task-edit",{taskId:r.id})}>
                            <ha-icon icon="mdi:pencil-outline"></ha-icon>
                            ${l("panel.cards.current.actions.edit",a)}
                        </button>
                        <button class="action-button" @click=${()=>this._fire("task-move",{taskId:r.id})}>
                            <ha-icon icon="mdi:folder-move-outline"></ha-icon>
                            ${l("panel.cards.current.actions.move",a)}
                        </button>
                        <button class="action-button danger" @click=${()=>this._removeTask(r.id)}>
                            <ha-icon icon="mdi:delete-outline"></ha-icon>
                            ${l("panel.list.remove",a)}
                        </button>
                    </div>
                `}
            </div>
        `}};C.styles=[ye,ft,D`
        :host {
            display: block;
            /* Size-responsive to the list's own width, not the viewport. */
            container-type: inline-size;
        }

        /* Header */
        .header {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 12px;
            padding: 16px 12px 0 16px;
        }

        .header-search {
            flex: 0 1 300px;
            margin-left: auto;
            padding-right: 4px;
        }

        .header-icon {
            flex-shrink: 0;
            display: grid;
            place-items: center;
            width: 42px;
            height: 42px;
            border-radius: 12px;
            background: color-mix(in srgb, var(--hm-c) 14%, transparent);
            color: var(--hm-ink);
            --mdc-icon-size: 22px;
        }

        .header-text {
            flex: 1;
            min-width: 0;
        }

        .title {
            font-size: 18px;
            font-weight: 600;
            line-height: 24px;
            color: var(--primary-text-color);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .subtitle {
            font-size: 13px;
            font-weight: 500;
            line-height: 18px;
            color: var(--hm-ink);
        }

        /* Search */
        .search-row {
            padding: 12px 16px 0;
        }

        .search {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 0 6px 0 12px;
            height: 40px;
            border-radius: 12px;
            background: var(--hm-subtle);
            border: 1px solid transparent;
            color: var(--secondary-text-color);
            --mdc-icon-size: 20px;
            transition: border-color 0.15s;
        }

        .search:focus-within {
            border-color: var(--primary-color);
        }

        .search input {
            flex: 1;
            min-width: 0;
            height: 100%;
            border: none;
            outline: none;
            background: transparent;
            color: var(--primary-text-color);
            font: inherit;
            font-size: 14px;
        }

        .search input::-webkit-search-cancel-button {
            display: none;
        }

        .search input::placeholder {
            color: var(--secondary-text-color);
        }

        /* Summary tiles */
        .summary {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
            padding: 14px 16px 0;
        }

        .tile {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
            min-width: 0;
            padding: 10px 12px;
            border-radius: 14px;
            text-align: left;
            background: color-mix(in srgb, var(--hm-c) 12%, transparent);
            transition: box-shadow 0.15s, opacity 0.15s, background-color 0.15s;
        }

        .tile:hover {
            background: color-mix(in srgb, var(--hm-c) 18%, transparent);
        }

        .tile ha-icon {
            position: absolute;
            top: 10px;
            right: 10px;
            color: var(--hm-ink);
            opacity: 0.85;
            --mdc-icon-size: 18px;
        }

        .tile-count {
            font-size: 26px;
            font-weight: 600;
            line-height: 32px;
            color: var(--hm-ink);
            font-variant-numeric: tabular-nums;
        }

        .tile-label {
            max-width: 100%;
            font-size: 12px;
            font-weight: 500;
            color: var(--secondary-text-color);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .tile.zero {
            background: var(--hm-subtle);
        }

        .tile.zero .tile-count,
        .tile.zero ha-icon {
            color: var(--secondary-text-color);
            opacity: 0.6;
        }

        .tile.active {
            box-shadow: inset 0 0 0 2px var(--hm-c);
        }

        .summary.filtering .tile:not(.active) {
            opacity: 0.55;
        }

        /* Group chips */
        .chips {
            display: flex;
            gap: 8px;
            padding: 12px 16px 2px;
            overflow-x: auto;
            scrollbar-width: none;
            /* Fade the trailing edge so overflowing chips read as scrollable. */
            -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 28px), transparent);
            mask-image: linear-gradient(to right, #000 calc(100% - 28px), transparent);
        }

        .chips::-webkit-scrollbar {
            display: none;
        }

        .chip {
            flex-shrink: 0;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            height: 32px;
            padding: 0 12px;
            border-radius: 16px;
            border: 1px solid var(--divider-color);
            font-size: 13px;
            font-weight: 500;
            white-space: nowrap;
            color: var(--primary-text-color);
            transition: background-color 0.15s, border-color 0.15s;
        }

        .chip:hover {
            background: var(--hm-subtle);
        }

        .chip.selected {
            background: color-mix(in srgb, var(--primary-color) 14%, transparent);
            border-color: color-mix(in srgb, var(--primary-color) 45%, transparent);
            color: color-mix(in srgb, var(--primary-color) 80%, var(--primary-text-color));
        }

        /* Toolbar: host filters (slot) + the group-by control */
        .list-toolbar {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px 12px;
            padding: 12px 16px 0;
        }

        ::slotted([slot="filters"]) {
            flex: 1 1 auto;
            min-width: 0;
        }

        .segmented {
            display: inline-flex;
            align-items: center;
            gap: 2px;
            margin-left: auto;
            padding: 3px;
            border-radius: 18px;
            background: var(--hm-subtle);
        }

        .segmented-label {
            padding: 0 8px 0 10px;
            font-size: 12px;
            font-weight: 500;
            color: var(--secondary-text-color);
        }

        .segmented button {
            height: 28px;
            padding: 0 12px;
            border-radius: 14px;
            font-size: 13px;
            font-weight: 500;
            color: var(--secondary-text-color);
            transition: background-color 0.15s, color 0.15s;
        }

        .segmented button.selected {
            background: var(--card-background-color, var(--ha-card-background, #fff));
            color: var(--primary-text-color);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
        }

        /* Sections */
        .task-list {
            padding: 6px 0 10px;
        }

        .section-header {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            padding: 14px 16px 6px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: var(--hm-ink);
        }

        .section.upcoming .section-header {
            color: var(--secondary-text-color);
        }

        .section.group .section-header {
            color: var(--primary-text-color);
        }

        .section-header .chip-badge {
            min-width: 18px;
            height: 18px;
            padding: 0 5px;
            letter-spacing: 0;
        }

        .section-count {
            font-weight: 500;
            color: var(--secondary-text-color);
            font-variant-numeric: tabular-nums;
        }

        .section-rule {
            flex: 1;
            height: 1px;
            background: var(--divider-color);
        }

        .chevron {
            color: var(--secondary-text-color);
            transition: transform 0.2s;
            --mdc-icon-size: 18px;
        }

        .chevron.collapsed {
            transform: rotate(-90deg);
        }

        .rows {
            display: flex;
            flex-direction: column;
            gap: 2px;
            padding: 0 8px;
        }

        /* Task rows */
        .row {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            align-items: center;
            padding-right: 8px;
            border-radius: 14px;
            transition: background-color 0.15s, opacity 0.2s;
        }

        .row:hover,
        .row.expanded {
            background: var(--hm-hover);
        }

        .row.completing {
            opacity: 0.5;
        }

        .row-main {
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 0;
            padding: 8px;
            border-radius: 14px;
            text-align: left;
        }

        .ring {
            position: relative;
            flex-shrink: 0;
            display: grid;
            place-items: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: color-mix(in srgb, var(--hm-c) 10%, transparent);
            color: var(--hm-ink);
            --mdc-icon-size: 20px;
        }

        .row.upcoming .ring {
            color: var(--secondary-text-color);
        }

        .ring svg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            transform: rotate(-90deg);
        }

        .ring-track {
            fill: none;
            stroke: color-mix(in srgb, var(--hm-c) 18%, transparent);
            stroke-width: 3;
        }

        .ring-arc {
            fill: none;
            stroke: var(--hm-c);
            stroke-width: 3;
            stroke-linecap: round;
            transition: stroke-dashoffset 0.4s ease;
        }

        .row-text {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .row-title {
            font-size: 15px;
            font-weight: 500;
            line-height: 20px;
            color: var(--primary-text-color);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .row.done .row-title {
            color: var(--secondary-text-color);
        }

        .row-meta {
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 0;
            font-size: 12.5px;
            line-height: 16px;
            color: var(--secondary-text-color);
            --mdc-icon-size: 14px;
        }

        .meta-item {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            white-space: nowrap;
        }

        .meta-group {
            min-width: 0;
        }

        .meta-text {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .meta-interval {
            flex-shrink: 0;
        }

        .meta-due {
            display: none;
        }

        .meta-item ha-icon {
            flex-shrink: 0;
            opacity: 0.8;
        }

        .row-due {
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 3px;
        }

        .pill {
            padding: 3px 9px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 600;
            line-height: 16px;
            white-space: nowrap;
            font-variant-numeric: tabular-nums;
            background: color-mix(in srgb, var(--hm-c) 15%, transparent);
            color: var(--hm-ink);
        }

        .row.upcoming .pill {
            background: var(--hm-subtle);
            color: var(--secondary-text-color);
        }

        .due-date {
            padding-right: 2px;
            font-size: 12px;
            line-height: 14px;
            color: var(--secondary-text-color);
            white-space: nowrap;
        }

        .check {
            display: grid;
            place-items: center;
            width: 40px;
            height: 40px;
            margin-left: 4px;
            border-radius: 50%;
            border: 2px solid var(--divider-color);
            color: var(--secondary-text-color);
            transition: background-color 0.15s, border-color 0.15s, color 0.15s, transform 0.1s;
            --mdc-icon-size: 20px;
        }

        .check:hover:not(:disabled) {
            background: var(--todo-done);
            border-color: var(--todo-done);
            color: var(--text-primary-color, #fff);
        }

        .check:active:not(:disabled) {
            transform: scale(0.92);
        }

        .check:disabled {
            cursor: default;
        }

        .row.done .check {
            background: var(--todo-done);
            border-color: var(--todo-done);
            color: var(--text-primary-color, #fff);
        }

        .row.completing .check {
            animation: hm-pulse 1s ease-in-out infinite;
        }

        /* Expanded details */
        .details {
            grid-column: 1 / -1;
            padding: 2px 8px 14px 60px;
            animation: hm-reveal 0.18s ease-out;
        }

        .description {
            margin: 0 0 12px;
            padding: 10px 12px;
            border-radius: 10px;
            border: 1px solid var(--divider-color);
            background: var(--card-background-color, var(--ha-card-background));
            font-size: 14px;
            line-height: 1.45;
            white-space: pre-wrap;
        }

        .facts {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 10px 16px;
        }

        .fact {
            display: flex;
            flex-direction: column;
            min-width: 0;
        }

        .fact-label {
            margin-bottom: 2px;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: var(--secondary-text-color);
        }

        .fact-value {
            font-size: 14px;
            font-variant-numeric: tabular-nums;
        }

        .fact-labels {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
        }

        .label-chip {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            padding: 1px 8px;
            border-radius: 10px;
            font-size: 12px;
            line-height: 18px;
            background: color-mix(in srgb, var(--label-color) 18%, transparent);
            color: color-mix(in srgb, var(--label-color) 70%, var(--primary-text-color));
            --mdc-icon-size: 14px;
        }

        .bar {
            height: 6px;
            margin-top: 5px;
            border-radius: 3px;
            overflow: hidden;
            background: color-mix(in srgb, var(--hm-c) 18%, transparent);
        }

        .bar > span {
            display: block;
            height: 100%;
            border-radius: 3px;
            background: var(--hm-c);
        }

        .history {
            margin-top: 12px;
        }

        /* Completion history as a small timeline, newest first. */
        .history .history-list {
            list-style: none;
            margin: 4px 0 0;
            padding: 0;
            font-size: 13px;
        }

        .history .history-list li {
            position: relative;
            margin: 0;
            padding: 2px 0 6px 18px;
        }

        .history .history-list li::before {
            content: "";
            position: absolute;
            left: 2px;
            top: 7px;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: var(--divider-color);
        }

        .history .history-list li:first-child::before {
            background: var(--todo-done);
        }

        .history .history-list li:not(:last-child)::after {
            content: "";
            position: absolute;
            left: 5px;
            top: 16px;
            bottom: -2px;
            width: 1px;
            background: var(--divider-color);
        }

        .details-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 14px;
        }

        .action-button {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            height: 32px;
            padding: 0 14px 0 10px;
            border-radius: 16px;
            border: 1px solid var(--divider-color);
            font-size: 13px;
            font-weight: 500;
            transition: background-color 0.15s;
            --mdc-icon-size: 18px;
        }

        .action-button:hover {
            background: var(--hm-subtle);
        }

        .action-button.danger {
            color: var(--todo-overdue);
        }

        .action-button.danger:hover {
            background: color-mix(in srgb, var(--todo-overdue) 10%, transparent);
        }

        /* Empty state */
        .empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 28px 16px 20px;
            font-size: 14px;
            color: var(--secondary-text-color);
            --mdc-icon-size: 40px;
        }

        .empty ha-icon {
            opacity: 0.5;
        }

        @keyframes hm-reveal {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: none; }
        }

        @keyframes hm-pulse {
            50% { transform: scale(0.9); }
        }

        /* Narrow lists (phones, narrow windows) — sized by the list, not
           the viewport. */
        @container (max-width: 560px) {
            .header-search {
                order: 3;
                flex-basis: 100%;
                margin-left: 0;
            }

            /* The control's aria-label still names it; the visible label
               would push it onto a row of its own. */
            .segmented-label {
                display: none;
            }
        }

        @container (max-width: 420px) {
            .tile ha-icon {
                display: none;
            }

            .tile-count {
                font-size: 22px;
                line-height: 28px;
            }

            .row-main {
                gap: 10px;
            }

            /* Give the title the full row: the due pill moves onto the
               meta line (the date is dropped) and long titles wrap. */
            .row-due {
                display: none;
            }

            .meta-due {
                display: inline-block;
                flex-shrink: 0;
                padding: 1px 7px;
                font-size: 11.5px;
            }

            .row-title {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                white-space: normal;
            }

            .details {
                padding-left: 8px;
            }
        }

        @container (max-width: 340px) {
            .meta-interval {
                display: none;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation: none !important;
                transition: none !important;
            }
        }
    `],h([x({attribute:!1})],C.prototype,"hass",2),h([x({attribute:!1})],C.prototype,"tasks",2),h([x({attribute:!1})],C.prototype,"groups",2),h([x()],C.prototype,"heading",2),h([x({type:Number})],C.prototype,"dueSoonDays",2),h([x()],C.prototype,"searchMode",2),h([x({type:Boolean})],C.prototype,"showGroupChips",2),h([x({attribute:!1})],C.prototype,"groupFilter",2),h([x()],C.prototype,"groupBy",2),h([x({attribute:!1})],C.prototype,"labelsByTask",2),h([x({type:Boolean})],C.prototype,"readonly",2),h([b()],C.prototype,"_completing",2),h([b()],C.prototype,"_expandedTasks",2),h([b()],C.prototype,"_collapsed",2),h([b()],C.prototype,"_searchQuery",2),h([b()],C.prototype,"_searchOpen",2),h([b()],C.prototype,"_statusFilter",2),h([R("hm-confirm-dialog")],C.prototype,"_confirmDialog",2),h([R(".search input")],C.prototype,"_searchInput",2);customElements.get("hm-task-list")||customElements.define("hm-task-list",C);var I=class extends A{constructor(){super(...arguments);this.groups=[];this.tasks=[];this.dueSoonDays=14;this.selected=null;this.manageOnly=!1;this.readonly=!1;this._editing=!1;this._creating=!1;this._newName="";this._renaming=null;this._renameValue=""}get _isEditing(){return this.manageOnly||this._editing}get _stats(){let t=this._statsCache;if(t&&t.tasks===this.tasks&&t.dueSoonDays===this.dueSoonDays)return t.stats;let r=c=>c.group_id?.trim()||"",a=new Map;this.tasks.forEach(c=>a.set(r(c),(a.get(r(c))??0)+1));let n=this.tasks.map(c=>({task:c,...dt(c,this.dueSoonDays)})),o=pt(n,c=>r(c.task)),s={total:a,attention:o};return this._statsCache={tasks:this.tasks,dueSoonDays:this.dueSoonDays,stats:s},s}_select(t){this.dispatchEvent(new CustomEvent("group-selected",{detail:{group:t},bubbles:!0,composed:!0}))}async _focusInput(){await this.updateComplete,this._input?.focus(),this._input?.select()}_startCreate(){this._creating=!0,this._newName="",this._focusInput()}async _commitCreate(){let t=this._newName.trim();if(!t){this._creating=!1;return}if(this.groups.includes(t)){$(this,l("panel.cards.groups.alerts.exists",this.hass.language,"{title}",t));return}try{await Er(this.hass,t),this._newName="",this._creating=this.manageOnly}catch(r){console.error("Failed to create group:",r),$(this,l("panel.cards.groups.alerts.error",this.hass.language))}}_startRename(t){this._renaming=t,this._renameValue=t,this._focusInput()}async _commitRename(){let t=this._renaming,r=this._renameValue.trim();if(!t||!r||t===r){this._renaming=null;return}if(this.groups.includes(r)){$(this,l("panel.cards.groups.alerts.exists",this.hass.language,"{title}",r));return}this._renaming=null;try{await Sr(this.hass,t,r),this.selected===t&&this._select(r)}catch(a){console.error("Failed to rename group:",a),$(this,l("panel.cards.groups.alerts.rename_error",this.hass.language))}}_confirmDelete(t){let r=this.hass.language;this._confirmDialog?.open({heading:l("panel.cards.groups.confirm_delete_title",r),message:l("panel.cards.groups.confirm_delete",r,"{title}",t),confirmLabel:l("panel.cards.groups.actions.delete",r),cancelLabel:l("common.cancel",r),destructive:!0,onConfirm:async()=>{try{await Ar(this.hass,t),this.selected===t&&this._select(null)}catch(a){console.error("Failed to delete group:",a),$(this,l("panel.cards.groups.alerts.delete_error",this.hass.language))}}})}_onInputKeydown(t,r,a){t.key==="Enter"?r():t.key==="Escape"&&(t.stopPropagation(),a())}render(){if(!this.hass)return d``;let t=this.hass.language,{total:r}=this._stats,a=r.get("")??0,n=this._isEditing;return d`
            ${this.manageOnly?_:this._renderItem(null,l("panel.nav.all_tasks",t),"mdi:format-list-checks",this.tasks.length)}

            ${this.readonly&&!this.groups.length?_:d`
                <div class="nav-heading">
                    <span>${l("panel.cards.groups.title",t)}</span>
                    <span class="spacer"></span>
                    ${this.readonly?_:d`
                        <button
                            class="icon-button small"
                            @click=${this._startCreate}
                            title=${l("panel.cards.groups.fields.new_group.heading",t)}
                            aria-label=${l("panel.cards.groups.fields.new_group.heading",t)}
                        >
                            <ha-icon icon="mdi:plus"></ha-icon>
                        </button>
                    `}
                    ${this.readonly||this.manageOnly||!this.groups.length?_:d`
                        <button class="text-button" @click=${()=>{this._editing=!this._editing,this._renaming=null}}>
                            ${l(n?"panel.nav.done_editing":"panel.cards.current.actions.edit",t)}
                        </button>
                    `}
                </div>
            `}

            ${this.groups.map(o=>n?this._renderEditableItem(o):this._renderItem(o,o,"mdi:folder-outline",r.get(o)??0))}

            ${this._creating||this.manageOnly&&!this.groups.length?d`
                <div class="nav-item editing">
                    <ha-icon icon="mdi:folder-plus-outline"></ha-icon>
                    <input
                        class="nav-input"
                        .value=${this._newName}
                        placeholder=${l("panel.cards.groups.fields.new_group.heading",t)}
                        aria-label=${l("panel.cards.groups.fields.new_group.heading",t)}
                        @input=${o=>this._newName=o.target.value}
                        @keydown=${o=>this._onInputKeydown(o,()=>this._commitCreate(),()=>{this._creating=!1})}
                        @blur=${()=>{!this._newName.trim()&&!this.manageOnly&&(this._creating=!1)}}
                    />
                    <button
                        class="icon-button small"
                        @click=${this._commitCreate}
                        title=${l("panel.cards.groups.actions.create",t)}
                        aria-label=${l("panel.cards.groups.actions.create",t)}
                    >
                        <ha-icon icon="mdi:check"></ha-icon>
                    </button>
                </div>
            `:_}

            ${!this.groups.length&&!this._creating&&!this.manageOnly&&!this.readonly?d`
                <p class="empty">${l("panel.cards.groups.empty",t)}</p>
            `:_}

            ${!this.manageOnly&&a&&this.groups.length?this._renderItem("",l("common.ungrouped",t),"mdi:folder-hidden",a):_}

            <hm-confirm-dialog></hm-confirm-dialog>
        `}_renderItem(t,r,a,n){let o=this.selected===t,s=t===null?this._totalAttention():this._stats.attention.get(t);return d`
            <button
                class="nav-item ${o?"selected":""}"
                aria-current=${o?"true":"false"}
                ?disabled=${this._isEditing}
                @click=${()=>this._select(t)}
            >
                <ha-icon .icon=${o&&a==="mdi:folder-outline"?"mdi:folder":a}></ha-icon>
                <span class="nav-label">${r}</span>
                ${s?d`<span class="chip-badge ${s.status}">${s.count}</span>`:_}
                <span class="nav-count">${n}</span>
            </button>
        `}_renderEditableItem(t){let r=this.hass.language;return d`
            <div class="nav-item editing">
                <ha-icon icon="mdi:folder-outline"></ha-icon>
                ${this._renaming===t?d`
                    <input
                        class="nav-input"
                        .value=${this._renameValue}
                        aria-label=${l("panel.cards.groups.actions.rename",r)}
                        @input=${a=>this._renameValue=a.target.value}
                        @keydown=${a=>this._onInputKeydown(a,()=>this._commitRename(),()=>{this._renaming=null})}
                    />
                    <button
                        class="icon-button small"
                        @click=${this._commitRename}
                        title=${l("panel.cards.groups.actions.save",r)}
                        aria-label=${l("panel.cards.groups.actions.save",r)}
                    >
                        <ha-icon icon="mdi:check"></ha-icon>
                    </button>
                `:d`
                    <span class="nav-label">${t}</span>
                    <button
                        class="icon-button small"
                        @click=${()=>this._startRename(t)}
                        title=${l("panel.cards.groups.actions.rename",r)}
                        aria-label=${`${l("panel.cards.groups.actions.rename",r)}: ${t}`}
                    >
                        <ha-icon icon="mdi:pencil-outline"></ha-icon>
                    </button>
                    <button
                        class="icon-button small danger"
                        @click=${()=>this._confirmDelete(t)}
                        title=${l("panel.cards.groups.actions.delete",r)}
                        aria-label=${`${l("panel.cards.groups.actions.delete",r)}: ${t}`}
                    >
                        <ha-icon icon="mdi:delete-outline"></ha-icon>
                    </button>
                `}
            </div>
        `}_totalAttention(){let t=0,r="due_soon";return this._stats.attention.forEach(a=>{t+=a.count,a.status==="overdue"&&(r="overdue")}),t?{count:t,status:r}:void 0}};I.styles=[ye,D`
        :host {
            display: block;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            min-height: 40px;
            padding: 0 10px 0 12px;
            box-sizing: border-box;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 500;
            color: var(--primary-text-color);
            text-align: left;
            transition: background-color 0.15s;
            --mdc-icon-size: 20px;
        }

        .nav-item ha-icon {
            flex-shrink: 0;
            color: var(--secondary-text-color);
        }

        button.nav-item:hover:not(:disabled) {
            background: var(--hm-subtle);
        }

        button.nav-item:disabled {
            cursor: default;
            opacity: 0.6;
        }

        .nav-item.selected {
            background: color-mix(in srgb, var(--primary-color) 14%, transparent);
            color: color-mix(in srgb, var(--primary-color) 80%, var(--primary-text-color));
        }

        .nav-item.selected ha-icon {
            color: inherit;
        }

        .nav-item.editing {
            padding-right: 4px;
        }

        .nav-label {
            flex: 1;
            min-width: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .nav-count {
            min-width: 16px;
            text-align: right;
            font-size: 12px;
            color: var(--secondary-text-color);
            font-variant-numeric: tabular-nums;
        }

        .nav-heading {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 14px 4px 4px 12px;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: var(--secondary-text-color);
        }

        .spacer {
            flex: 1;
        }

        .text-button {
            height: 28px;
            padding: 0 10px;
            border-radius: 14px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0;
            text-transform: none;
            color: var(--primary-color);
        }

        .text-button:hover {
            background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        }

        .nav-input {
            flex: 1;
            min-width: 0;
            height: 32px;
            padding: 0 10px;
            box-sizing: border-box;
            border: 1px solid var(--primary-color);
            border-radius: 8px;
            background: var(--card-background-color, transparent);
            color: var(--primary-text-color);
            font: inherit;
            font-size: 14px;
            outline: none;
        }

        .icon-button.danger:hover {
            color: var(--todo-overdue);
            background: color-mix(in srgb, var(--todo-overdue) 10%, transparent);
        }

        .empty {
            margin: 4px 12px 8px;
            font-size: 13px;
            line-height: 1.4;
            color: var(--secondary-text-color);
        }
    `],h([x({attribute:!1})],I.prototype,"hass",2),h([x({attribute:!1})],I.prototype,"groups",2),h([x({attribute:!1})],I.prototype,"tasks",2),h([x({type:Number})],I.prototype,"dueSoonDays",2),h([x({attribute:!1})],I.prototype,"selected",2),h([x({type:Boolean})],I.prototype,"manageOnly",2),h([x({type:Boolean})],I.prototype,"readonly",2),h([b()],I.prototype,"_editing",2),h([b()],I.prototype,"_creating",2),h([b()],I.prototype,"_newName",2),h([b()],I.prototype,"_renaming",2),h([b()],I.prototype,"_renameValue",2),h([R("hm-confirm-dialog")],I.prototype,"_confirmDialog",2),h([R(".nav-input")],I.prototype,"_input",2);customElements.get("hm-group-nav")||customElements.define("hm-group-nav",I);var Ur=(e,i,t,r)=>{try{return l(`${e.keyPrefix}.${i}.${t}`,e.hass.language)??r}catch{return r}},xt=(e,i)=>d`
    <div class="field ${i.name}">
        <div class="field-label">
            ${Ur(e,i.name,"heading",i.name)}${i.required?" *":""}
        </div>
        <ha-selector
            .hass=${e.hass}
            .selector=${i.selector}
            .value=${e.data[i.name]}
            .helper=${Ur(e,i.name,"helper","")}
            .required=${i.required??!1}
            @value-changed=${t=>e.onChange(i.name,t)}
        ></ha-selector>
    </div>
`,wt=D`
    .fields-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
        column-gap: 8px;
        row-gap: 16px;
        align-items: start;
    }

    .field-label {
        font-size: 12px;
        font-weight: 500;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .field ha-selector {
        display: block;
        width: 100%;
    }

    /* Description spans the full line below the other fields. */
    .field.description {
        grid-column: 1 / -1;
    }
`;var we=()=>({title:"",trigger_type:"time",interval_value:"",interval_type:"days",last_performed:"",anchor_date:"",active_months:[],icon:"",label:[],tag:"",count_entity_id:"",count_threshold:"",runtime_entity_id:"",runtime_threshold:"",area:"",description:"",group_id:"",notifications_enabled:!1,notification_target:"",notification_time:"09:00",notification_url:"",notify_when:"due_and_overdue",notify_days_before_due:""}),jr=(e,i,t)=>({title:e.title,trigger_type:e.trigger_type??"time",interval_value:e.interval_value,interval_type:e.interval_type,last_performed:e.last_performed??"",anchor_date:e.anchor_date??"",active_months:(e.active_months??[]).map(String),icon:e.icon??"",label:t.map(r=>r.label_id),tag:e.tag_id??"",count_entity_id:e.count_entity_id??"",count_threshold:e.count_threshold??"",runtime_entity_id:e.runtime_entity_id??"",runtime_threshold:e.runtime_threshold??"",area:i?.area_id??"",description:e.description??"",group_id:e.group_id??"",notifications_enabled:e.notifications_enabled??!1,notification_target:e.notification_target??"",notification_time:e.notification_time??"09:00",notification_url:e.notification_url??"",notify_when:e.notify_when??"due_and_overdue",notify_days_before_due:e.notify_days_before_due??""}),co=e=>({name:"trigger_type",required:!0,selector:{select:{options:[{value:"time",label:l("trigger_types.time",e)},{value:"date",label:l("trigger_types.date",e)},{value:"count",label:l("trigger_types.count",e)},{value:"runtime",label:l("trigger_types.runtime",e)}],mode:"dropdown"}}}),uo=e=>{let i;try{i=new Intl.DateTimeFormat(e,{month:"long"})}catch{i=new Intl.DateTimeFormat("en",{month:"long"})}return Array.from({length:12},(t,r)=>({value:String(r+1),label:i.format(new Date(2026,r,1,12))}))},po=e=>({name:"active_months",selector:{select:{options:uo(e),multiple:!0,mode:"dropdown"}}}),Gr=e=>({name:"interval_type",required:!0,selector:{select:{options:ht.map(i=>({value:i,label:mr(e)[i]})),mode:"dropdown"}}}),ho=(e,i)=>e.trigger_type==="date"?[{name:"anchor_date",required:!0,selector:{date:{}}},{name:"interval_value",required:!0,selector:{number:{min:1,mode:"box"}}},Gr(i)]:e.trigger_type==="count"?[{name:"count_entity_id",required:!0,selector:{entity:{}}},{name:"count_threshold",required:!0,selector:{number:{min:1,mode:"box"}}}]:e.trigger_type==="runtime"?[{name:"runtime_entity_id",required:!0,selector:{entity:{filter:{domain:"sensor"}}}},{name:"runtime_threshold",required:!0,selector:{number:{min:.1,step:.1,mode:"box"}}}]:[{name:"interval_value",required:!0,selector:{number:{min:1,mode:"box"}}},Gr(i),po(i)],di=(e,i)=>({name:"group_id",selector:{select:{options:[{value:"",label:l("common.ungrouped",i)},...e.map(t=>({value:t,label:t}))],mode:"dropdown",custom_value:!0}}}),kt=(e,i)=>[{name:"title",required:!0,selector:{text:{}}},co(i),...ho(e,i)],Tt={name:"last_performed",selector:{date:{}}},Et=(e,i)=>[di(e,i),{name:"icon",selector:{icon:{}}},{name:"tag",selector:{entity:{filter:{domain:"tag"}}}},{name:"area",selector:{area:{}}},{name:"label",selector:{label:{multiple:!0}}}],St=e=>({name:"description",selector:{text:e?{multiline:!0}:{}}}),At=(e,i,t)=>{let r={name:"notifications_enabled",selector:{boolean:{}}};return e.notifications_enabled?[r,{name:"notification_target",selector:{select:{options:[{value:"",label:l("common.none",t)},...i.map(a=>({value:a,label:a}))],mode:"dropdown",custom_value:!0}}},{name:"notify_when",selector:{select:{options:[{value:"due",label:l("notifications.when.due",t)},{value:"overdue",label:l("notifications.when.overdue",t)},{value:"due_and_overdue",label:l("notifications.when.due_and_overdue",t)}],mode:"dropdown"}}},...e.trigger_type==="time"||e.trigger_type==="date"?[{name:"notify_days_before_due",selector:{number:{min:1,mode:"box"}}}]:[],{name:"notification_time",selector:{time:{no_second:!0}}},{name:"notification_url",selector:{text:{}}}]:[r]},$t=e=>e.title?.trim()?e.trigger_type==="count"?!!(e.count_entity_id?.trim()&&e.count_threshold):e.trigger_type==="runtime"?!!(e.runtime_entity_id?.trim()&&e.runtime_threshold):e.trigger_type==="date"?!!(e.anchor_date?.trim()&&e.interval_value&&e.interval_type):!!(e.interval_value&&e.interval_type):!1,ke=e=>{if(!e){let c=new Date;return c.setHours(0,0,0,0),c.toISOString()}let[i,t,r]=e.split("T")[0].split("-"),a=Number(i),n=Number(t),o=Number(r);if(isNaN(a)||isNaN(n)||isNaN(o))return null;let s=new Date(a,n-1,o);return s.setHours(0,0,0,0),s.toISOString()},Vr=e=>({notifications_enabled:e.notifications_enabled??!1,notification_target:e.notification_target?.trim()||null,notification_time:e.notification_time?.trim()||"09:00",notification_url:e.notification_url?.trim()||null,notify_when:e.notify_when||"due_and_overdue",notify_days_before_due:e.notify_days_before_due===""||e.notify_days_before_due==null?null:Number(e.notify_days_before_due)}),qr=e=>{let i=e.trigger_type==="count",t=e.trigger_type==="runtime",r=e.trigger_type==="date",a=!i&&!t&&!r;return{trigger_type:e.trigger_type||"time",interval_value:i||t?1:Number(e.interval_value),interval_type:i||t?"days":e.interval_type,anchor_date:r&&e.anchor_date?.trim().split("T")[0]||null,active_months:a?(e.active_months??[]).map(Number):[],count_entity_id:i&&e.count_entity_id?.trim()||null,count_threshold:i?Number(e.count_threshold):0,runtime_entity_id:t&&e.runtime_entity_id?.trim()||null,runtime_threshold:t?Number(e.runtime_threshold):0}},Wr=(e,i)=>{let t=qr(e),r=e.trigger_type==="date"&&!e.last_performed?.trim();return{title:e.title.trim(),interval_value:t.interval_value,interval_type:t.interval_type,trigger_type:t.trigger_type,...r?{}:{last_performed:i},tag_id:e.tag?.trim()||void 0,icon:e.icon?.trim()||"mdi:calendar-check",labels:e.label??[],area_id:e.area?.trim()||void 0,description:e.description||void 0,group_id:e.group_id?.trim()||void 0,...t.anchor_date?{anchor_date:t.anchor_date}:{},...t.active_months.length?{active_months:t.active_months}:{},...t.count_entity_id?{count_entity_id:t.count_entity_id,count_threshold:t.count_threshold}:{},...t.runtime_entity_id?{runtime_entity_id:t.runtime_entity_id,runtime_threshold:t.runtime_threshold}:{},...Vr(e)}},Zr=(e,i)=>({title:e.title.trim(),...qr(e),last_performed:i,icon:e.icon?.trim()||"mdi:calendar-check",labels:e.label,tag_id:e.tag?.trim()||null,area_id:e.area?.trim()||null,description:e.description??"",group_id:e.group_id?.trim()||null,...Vr(e)});var fe=class extends A{constructor(){super(...arguments);this.groups=[];this._formData=we();this._advancedOpen=!1;this._handleFieldChanged=(t,r)=>{r.stopPropagation(),this._formData={...this._formData,[t]:r.detail.value}};this._renderField=t=>xt({hass:this.hass,keyPrefix:"panel.cards.new.fields",data:this._formData,onChange:this._handleFieldChanged},t)}prefill(t){this._formData={...this._formData,...t}}async submit(){if(!$t(this._formData)){$(this,l("panel.cards.new.alerts.required",this.hass.language));return}let t=ke(this._formData.last_performed);if(t===null){$(this,l("common.invalid_date",this.hass.language));return}try{let r=this._formData.title.trim();await _t(this.hass,Wr(this._formData,t)),this._formData=we(),this.dispatchEvent(new CustomEvent("task-added",{detail:{title:r},bubbles:!0,composed:!0}))}catch(r){console.error("Failed to add task:",r),$(this,l("panel.cards.new.alerts.error",this.hass.language))}}render(){return this.hass?d`
            <div class="fields-grid">
                ${kt(this._formData,this.hass.language).map(this._renderField)}
            </div>

            <ha-expansion-panel
                header="${l("panel.cards.new.sections.optional",this.hass.language)}"
                .opened=${this._advancedOpen}
                @opened-changed=${t=>this._advancedOpen=t.detail.value}
                class="extras-panel"
            >
                <div class="fields-grid">
                    ${this._renderField(Tt)}
                    ${Et(this.groups,this.hass.language).map(this._renderField)}
                    ${this._renderField(St(!1))}
                </div>

                <div class="section-label">
                    ${l("panel.cards.new.sections.notifications",this.hass.language)}
                </div>
                <div class="fields-grid">
                    ${At(this._formData,mt(this.hass),this.hass.language).map(this._renderField)}
                </div>
            </ha-expansion-panel>
        `:d``}};fe.styles=[N,wt,D`
        .section-label {
            font-weight: 500;
            color: var(--secondary-text-color);
            margin: 20px 0 12px;
        }
    `],h([x()],fe.prototype,"hass",2),h([x({attribute:!1})],fe.prototype,"groups",2),h([b()],fe.prototype,"_formData",2);customElements.get("hm-task-form")||customElements.define("hm-task-form",fe);var V=class extends A{constructor(){super(...arguments);this.groups=[];this._open=!1;this._submitting=!1}async open(t){this._open=!0,await this.updateComplete,t&&this._form?.prefill(t)}_close(){this._open=!1}async _submit(){if(!this._submitting){this._submitting=!0;try{await this._form?.submit()}finally{this._submitting=!1}}}_browseTemplates(){this._close(),this.dispatchEvent(new CustomEvent("browse-templates",{bubbles:!0,composed:!0}))}render(){if(!this.hass||!this._open)return d``;let t=this.hass.language;return d`
            <ha-dialog
                open
                heading=${l("panel.cards.new.title",t)}
                header-title=${l("panel.cards.new.title",t)}
                prevent-scrim-close
                @closed=${this._close}
            >
                <hm-task-form
                    .hass=${this.hass}
                    .groups=${this.groups}
                    @task-added=${this._close}
                ></hm-task-form>

                ${B(d`
                    <ha-button appearance="plain" slot="secondaryAction" @click=${this._browseTemplates}>
                        ${l("panel.cards.current.filter.templates",t)}
                    </ha-button>
                    <ha-button
                        data-dialog="close"
                        appearance="plain"
                        slot="secondaryAction"
                        @click=${this._close}
                    >
                        ${l("common.cancel",t)}
                    </ha-button>
                    <ha-button
                        slot="primaryAction"
                        class="submit-button"
                        ?disabled=${this._submitting}
                        @click=${this._submit}
                    >
                        ${l("panel.cards.new.actions.add_task",t)}
                    </ha-button>
                `)}
            </ha-dialog>
        `}};V.styles=N,h([x()],V.prototype,"hass",2),h([x({attribute:!1})],V.prototype,"groups",2),h([b()],V.prototype,"_open",2),h([b()],V.prototype,"_submitting",2),h([R("hm-task-form")],V.prototype,"_form",2);customElements.get("hm-add-task-dialog")||customElements.define("hm-add-task-dialog",V);var H=class extends A{constructor(){super(...arguments);this.registry=[];this.labelRegistry=[];this.groups=[];this._taskId=null;this._formData=we();this._history=[];this._handleFieldChanged=(t,r)=>{r.stopPropagation(),this._formData={...this._formData,[t]:r.detail.value}};this._renderField=t=>xt({hass:this.hass,keyPrefix:"panel.dialog.edit_task.fields",data:this._formData,onChange:this._handleFieldChanged},t)}async open(t){try{let r=await xr(this.hass,t),a=this.registry.find(o=>o.unique_id===r.id),n=a?this.labelRegistry.filter(o=>a.labels.includes(o.label_id)):[];this._formData=jr(r,a,n),this._history=r.history??[],this._taskId=r.id}catch(r){console.error("Failed to fetch task for edit:",r)}}async _handleSaveClick(){if(!this._taskId)return;if(!$t(this._formData)){$(this,l("panel.cards.new.alerts.required",this.hass.language));return}let t=ke(this._formData.last_performed);if(t===null){$(this,l("common.invalid_date",this.hass.language));return}try{await vt(this.hass,{task_id:this._taskId,updates:Zr(this._formData,t)}),this._close()}catch(r){console.error("Failed to update task:",r),$(this,l("panel.dialog.edit_task.alerts.error",this.hass.language))}}_close(){this._taskId=null,this._formData=we(),this._history=[]}async _handleTestNotification(){let t=this.registry.find(r=>r.unique_id===this._taskId);if(t)try{await this.hass.callService("tasks","send_task_notification",{entity_id:t.entity_id})}catch(r){console.error("Failed to send test notification:",r),$(this,l("panel.dialog.edit_task.alerts.test_error",this.hass.language))}}render(){if(!this.hass||!this._taskId)return d``;let t=this.hass.language;return d`
            <ha-dialog
                open
                heading="${l("panel.dialog.edit_task.title",t)}: ${this._formData.title}"
                header-title="${l("panel.dialog.edit_task.title",t)}: ${this._formData.title}"
                prevent-scrim-close
                @closed=${this._close}
            >
                <div class="fields-grid">
                    ${kt(this._formData,t).map(this._renderField)}
                    ${this._renderField(Tt)}
                </div>

                <div class="section-label">
                    ${l("panel.dialog.edit_task.sections.optional",t)}
                </div>

                <div class="fields-grid">
                    ${Et(this.groups,t).map(this._renderField)}
                    ${this._renderField(St(!0))}
                </div>

                <div class="section-label">
                    ${l("panel.dialog.edit_task.sections.notifications",t)}
                </div>

                <div class="fields-grid">
                    ${At(this._formData,mt(this.hass),t).map(this._renderField)}
                </div>
                ${this._formData.notifications_enabled?d`
                    <ha-button
                        appearance="plain"
                        size="small"
                        class="test-notification"
                        @click=${this._handleTestNotification}
                    >
                        ${l("panel.dialog.edit_task.actions.test_notification",t)}
                    </ha-button>
                `:""}

                ${this._history.length?d`
                    <div class="section-label">
                        ${l("panel.dialog.edit_task.sections.history",t)}
                    </div>
                    <div class="history-scroll">
                        ${gt(this._history,this._history.length,this.hass.locale)}
                    </div>
                `:_}

                ${B(d`
                    <ha-button
                        data-dialog="close"
                        appearance="plain"
                        slot="secondaryAction"
                        @click=${this._close}
                    >
                        ${l("panel.dialog.edit_task.actions.cancel",t)}
                    </ha-button>
                    <ha-button slot="primaryAction" @click=${this._handleSaveClick}>
                        ${l("panel.dialog.edit_task.actions.save",t)}
                    </ha-button>
                `)}
            </ha-dialog>
        `}};H.styles=[N,wt,ft,D`
        .section-label {
            font-weight: 500;
            color: var(--secondary-text-color);
            margin: 20px 0 12px;
        }

        .test-notification {
            margin-top: 12px;
        }
    `],h([x()],H.prototype,"hass",2),h([x({attribute:!1})],H.prototype,"registry",2),h([x({attribute:!1})],H.prototype,"labelRegistry",2),h([x({attribute:!1})],H.prototype,"groups",2),h([b()],H.prototype,"_taskId",2),h([b()],H.prototype,"_formData",2),h([b()],H.prototype,"_history",2);customElements.get("hm-edit-dialog")||customElements.define("hm-edit-dialog",H);var ae=class extends A{constructor(){super(...arguments);this.groups=[];this._task=null;this._groupId=""}open(t){this._task=t,this._groupId=t.group_id??""}_close(){this._task=null}async _handleMove(){if(this._task)try{await vt(this.hass,{task_id:this._task.id,updates:{group_id:this._groupId?.trim()||null}}),this._close()}catch(t){console.error("Failed to move task:",t)}}render(){if(!this.hass||!this._task)return d``;let t=this.hass.language;return d`
            <ha-dialog
                open
                heading="${l("panel.dialog.move_task.title",t)}: ${this._task.title}"
                header-title="${l("panel.dialog.move_task.title",t)}: ${this._task.title}"
                @closed=${this._close}
            >
                <ha-form
                    .hass=${this.hass}
                    .schema=${[di(this.groups,t)]}
                    .computeLabel=${()=>l("panel.dialog.move_task.fields.group_id.heading",t)}
                    .data=${{group_id:this._groupId}}
                    @value-changed=${r=>this._groupId=r.detail.value.group_id??""}
                ></ha-form>

                ${B(d`
                    <ha-button
                        data-dialog="close"
                        appearance="plain"
                        slot="secondaryAction"
                        @click=${this._close}
                    >
                        ${l("panel.dialog.move_task.actions.cancel",t)}
                    </ha-button>
                    <ha-button slot="primaryAction" @click=${this._handleMove}>
                        ${l("panel.dialog.move_task.actions.move",t)}
                    </ha-button>
                `)}
            </ha-dialog>
        `}};ae.styles=N,h([x()],ae.prototype,"hass",2),h([x({attribute:!1})],ae.prototype,"groups",2),h([b()],ae.prototype,"_task",2),h([b()],ae.prototype,"_groupId",2);customElements.get("hm-move-dialog")||customElements.define("hm-move-dialog",ae);var Xr=["hvac","plumbing","electrical","appliances","interior","exterior","yard","safety","vehicles"],p=(e,i,t,r,a,n)=>({category:e,title:i,description:t,interval_value:r,interval_type:a,icon:n}),ui=[p("hvac","Replace HVAC filter","Replace the furnace/air-handler filter; check size and MERV rating.",3,"months","mdi:air-filter"),p("hvac","Service furnace","Annual professional furnace inspection and tune-up before heating season.",1,"years","mdi:fire"),p("hvac","Service air conditioner","Annual professional A/C inspection and refrigerant check before cooling season.",1,"years","mdi:air-conditioner"),p("hvac","Clean A/C condenser coils","Rinse debris from the outdoor condenser unit and clear vegetation around it.",6,"months","mdi:hvac"),p("hvac","Clean air vents and registers","Vacuum supply and return registers; check for blockages.",6,"months","mdi:air-purifier"),p("hvac","Clean ceiling fan blades","Dust fan blades and check for wobble; reverse direction seasonally.",6,"months","mdi:ceiling-fan"),p("hvac","Replace humidifier filter","Replace the whole-home humidifier evaporator pad.",1,"years","mdi:air-humidifier"),p("hvac","Clean dehumidifier","Empty, clean the tank and filter, and check drainage.",3,"months","mdi:water-percent"),p("hvac","Have air ducts inspected","Inspect ductwork for leaks and dust buildup; consider cleaning.",5,"years","mdi:pipe"),p("hvac","Clean bathroom exhaust fans","Remove covers and vacuum dust from bathroom exhaust fans.",6,"months","mdi:fan"),p("plumbing","Flush water heater","Drain sediment from the water heater tank and test the pressure-relief valve.",1,"years","mdi:water-boiler"),p("plumbing","Test sump pump","Pour water into the sump pit and verify the pump runs and drains.",3,"months","mdi:water-pump"),p("plumbing","Clean faucet aerators","Unscrew aerators and rinse out sediment for steady flow.",6,"months","mdi:faucet"),p("plumbing","Check for plumbing leaks","Inspect under sinks, around toilets, and exposed pipes for moisture.",3,"months","mdi:pipe-leak"),p("plumbing","Clean shower heads","Descale shower heads with vinegar to restore spray pattern.",6,"months","mdi:shower-head"),p("plumbing","Inspect washing machine hoses","Check supply hoses for bulges or leaks; replace every 5 years.",6,"months","mdi:washing-machine"),p("plumbing","Clean garbage disposal","Freshen the disposal with ice, citrus peel, and a rinse.",1,"months","mdi:sink"),p("plumbing","Snake slow drains","Clear hair and buildup from bathroom drains before they clog.",6,"months","mdi:pipe-wrench"),p("plumbing","Inspect toilet internals","Check flapper, fill valve, and for silent leaks with a dye test.",1,"years","mdi:toilet"),p("plumbing","Service water softener","Check salt level and clean the brine tank.",1,"months","mdi:water-opacity"),p("plumbing","Replace water filter cartridge","Replace under-sink or whole-home water filter cartridges.",6,"months","mdi:filter"),p("plumbing","Winterize outdoor faucets","Disconnect hoses, drain exterior spigots, and insulate before frost.",1,"years","mdi:snowflake-alert"),p("electrical","Test GFCI outlets","Press test/reset on every GFCI outlet to verify protection.",6,"months","mdi:power-socket-us"),p("electrical","Test AFCI breakers","Trip and reset arc-fault breakers in the panel.",6,"months","mdi:electric-switch"),p("electrical","Inspect electrical panel","Look for corrosion, heat marks, or loose breakers; label circuits.",1,"years","mdi:lightning-bolt"),p("electrical","Check cords and outlets","Inspect for frayed cords, warm outlets, and overloaded strips.",1,"years","mdi:power-plug"),p("electrical","Test backup generator","Run the generator under load and check oil and fuel.",3,"months","mdi:engine"),p("electrical","Replace UPS batteries","Test uninterruptible power supplies and replace aging batteries.",3,"years","mdi:battery-charging"),p("electrical","Dust electronics and vents","Blow dust from equipment vents, routers, and media consoles.",3,"months","mdi:desktop-classic"),p("appliances","Clean refrigerator coils","Vacuum condenser coils under/behind the fridge for efficiency.",6,"months","mdi:fridge"),p("appliances","Replace refrigerator water filter","Swap the fridge water/ice filter cartridge.",6,"months","mdi:cup-water"),p("appliances","Clean dishwasher filter","Remove and rinse the dishwasher filter; wipe door seals.",1,"months","mdi:dishwasher"),p("appliances","Run dishwasher cleaner","Run an empty hot cycle with dishwasher cleaner or vinegar.",3,"months","mdi:dishwasher-alert"),p("appliances","Clean washing machine","Run a tub-clean cycle and wipe the door gasket to prevent mildew.",3,"months","mdi:washing-machine"),p("appliances","Clean dryer lint duct","Disconnect the dryer and clear lint from the duct to the exterior vent.",1,"years","mdi:tumble-dryer"),p("appliances","Vacuum dryer lint housing","Vacuum the lint-screen housing and behind the dryer.",3,"months","mdi:tumble-dryer-alert"),p("appliances","Clean oven","Deep-clean the oven interior and door glass.",6,"months","mdi:stove"),p("appliances","Clean range hood filter","Degrease the range hood mesh filter in hot soapy water.",3,"months","mdi:fan"),p("appliances","Descale coffee maker","Run a descaling cycle through the coffee maker or espresso machine.",3,"months","mdi:coffee-maker"),p("appliances","Clean microwave and seals","Clean interior, turntable, and check door seals.",1,"months","mdi:microwave"),p("appliances","Defrost chest freezer","Defrost and clean the freezer; check door gaskets.",1,"years","mdi:fridge-bottom"),p("appliances","Replace vacuum filters","Replace or wash vacuum cleaner filters and check the brush roll.",6,"months","mdi:robot-vacuum"),p("interior","Deep clean carpets","Shampoo or steam-clean carpets and rugs.",1,"years","mdi:rug"),p("interior","Wash windows inside","Clean interior window glass, sills, and tracks.",6,"months","mdi:window-closed-variant"),p("interior","Clean window treatments","Dust or launder blinds, shades, and curtains.",6,"months","mdi:blinds"),p("interior","Touch up paint and caulk","Touch up wall paint; re-caulk tubs, showers, and backsplashes.",1,"years","mdi:format-paint"),p("interior","Lubricate door hinges and locks","Silence squeaks and lubricate locks with graphite.",1,"years","mdi:door"),p("interior","Clean baseboards and trim","Wipe down baseboards, door frames, and switch plates.",3,"months","mdi:broom"),p("interior","Rotate mattresses","Rotate (and flip if applicable) mattresses for even wear.",3,"months","mdi:bed"),p("interior","Wash pillows and duvets","Launder pillows, duvets, and mattress protectors.",6,"months","mdi:bed-king"),p("interior","Inspect attic and basement","Look for leaks, pests, and mold in the attic and basement/crawlspace.",6,"months","mdi:home-search"),p("interior","Check door and window seals","Inspect weatherstripping and replace worn seals.",1,"years","mdi:window-shutter"),p("interior","Clean light fixtures","Dust fixtures and wash glass shades; replace dim bulbs.",6,"months","mdi:ceiling-light"),p("interior","Descale humidifiers","Descale and disinfect portable humidifiers.",1,"months","mdi:air-humidifier"),p("exterior","Clean gutters","Remove leaves and debris from gutters and check downspout flow.",6,"months","mdi:home-roof"),p("exterior","Inspect roof","Check shingles/flashing for damage from the ground or ladder.",1,"years","mdi:home-alert"),p("exterior","Wash siding","Rinse or soft-wash siding to remove dirt and mildew.",1,"years","mdi:home-modern"),p("exterior","Wash windows outside","Clean exterior window glass and screens.",6,"months","mdi:window-open-variant"),p("exterior","Inspect driveway and walkways","Look for cracks to seal and settled pavers to relevel.",1,"years","mdi:road-variant"),p("exterior","Seal deck or fence","Clean and re-stain/seal wooden decks and fences.",2,"years","mdi:fence"),p("exterior","Inspect exterior paint and caulk","Check for peeling paint and failed caulk around openings.",1,"years","mdi:brush"),p("exterior","Clean garage door tracks","Clear tracks, lubricate rollers/springs, and test auto-reverse.",1,"years","mdi:garage"),p("exterior","Inspect foundation","Walk the foundation looking for new cracks or water pooling.",1,"years","mdi:home-floor-b"),p("exterior","Check chimney and cap","Inspect the chimney exterior and cap; schedule a sweep if used.",1,"years","mdi:fireplace"),p("exterior","Clean outdoor furniture","Wash outdoor furniture and check covers.",6,"months","mdi:table-chair"),p("exterior","Clean grill","Deep-clean grill grates and burners; check propane connections.",6,"months","mdi:grill"),p("yard","Fertilize lawn","Apply seasonal fertilizer appropriate for your grass type.",3,"months","mdi:grass"),p("yard","Prune trees and shrubs","Prune dead growth and branches near the house or lines.",1,"years","mdi:tree"),p("yard","Mulch garden beds","Refresh mulch in planting beds for moisture and weed control.",1,"years","mdi:flower"),p("yard","Service lawn mower","Change oil, sharpen the blade, and replace the spark plug.",1,"years","mdi:mower"),p("yard","Start up irrigation system","Recharge the sprinkler system and check heads in spring.",1,"years","mdi:sprinkler-variant"),p("yard","Winterize irrigation system","Blow out sprinkler lines before the first freeze.",1,"years","mdi:sprinkler"),p("yard","Clean and store hoses","Drain garden hoses and check spray nozzles.",1,"years","mdi:watering-can"),p("yard","Inspect trees after storms","Check for damaged limbs and clear debris.",6,"months","mdi:tree-outline"),p("yard","Reseed bare lawn spots","Overseed thin areas and water until established.",1,"years","mdi:seed"),p("safety","Test smoke detectors","Press the test button on every smoke detector.",1,"months","mdi:smoke-detector"),p("safety","Test carbon monoxide detectors","Test CO detectors and note their replacement date.",1,"months","mdi:molecule-co"),p("safety","Replace detector batteries","Replace batteries in smoke and CO detectors.",1,"years","mdi:battery-alert"),p("safety","Inspect fire extinguishers","Check gauge pressure, pin, and expiration on each extinguisher.",6,"months","mdi:fire-extinguisher"),p("safety","Practice fire escape plan","Review and practice the household emergency escape plan.",1,"years","mdi:exit-run"),p("safety","Check emergency kit","Rotate water, food, batteries, and medications in the emergency kit.",6,"months","mdi:medical-bag"),p("safety","Test security system","Test alarm sensors, cameras, and backup batteries.",6,"months","mdi:shield-home"),p("safety","Clean dryer vent exterior flap","Verify the exterior dryer vent flap opens and is lint-free.",6,"months","mdi:tumble-dryer"),p("safety","Test water shutoff valve","Exercise the main water shutoff so it moves freely in an emergency.",1,"years","mdi:valve"),p("safety","Restock first aid kit","Replace used and expired first aid supplies.",6,"months","mdi:bandage"),p("vehicles","Change vehicle oil","Change engine oil and filter per the manufacturer schedule.",6,"months","mdi:oil"),p("vehicles","Rotate tires","Rotate tires and check tread depth and pressure.",6,"months","mdi:tire"),p("vehicles","Replace wiper blades","Replace windshield wiper blades and top up washer fluid.",1,"years","mdi:wiper"),p("vehicles","Check vehicle battery","Test battery health and clean terminal corrosion.",1,"years","mdi:car-battery"),p("vehicles","Replace cabin air filter","Replace the vehicle cabin air filter.",1,"years","mdi:car-defrost-front"),p("vehicles","Wash and wax vehicle","Wash, decontaminate, and wax the paint.",3,"months","mdi:car-wash"),p("vehicles","Check bicycle tune-up","Lubricate the chain, check brakes and tire pressure.",6,"months","mdi:bike")];var O=class extends A{constructor(){super(...arguments);this._open=!1;this._query="";this._csvRows=null;this._csvErrors=[];this._importing=!1;this._close=()=>{this._open=!1,this._query="",this._resetCsv()}}open(){this._open=!0}_resetCsv(){this._csvRows=null,this._csvErrors=[],this._importing=!1,this._fileInput&&(this._fileInput.value="")}get _filteredTemplates(){let t=this._query.trim().toLowerCase();return t?ui.filter(r=>`${r.title}
${r.description}`.toLowerCase().includes(t)):ui}_selectTemplate(t){this.dispatchEvent(new CustomEvent("template-selected",{detail:{template:t},bubbles:!0,composed:!0})),this._close()}async _handleFilePicked(t){let r=t.target.files?.[0];if(!r)return;let a=await r.text(),n=fr(gr(a));this._csvRows=n.tasks,this._csvErrors=n.errors}async _handleImport(){if(!this._csvRows?.length||this._importing)return;this._importing=!0;let t=0,r=[];for(let a of this._csvRows)try{await _t(this.hass,{title:a.title,interval_value:a.interval_value,interval_type:a.interval_type,trigger_type:"time",last_performed:ke(a.last_performed??""),icon:a.icon||"mdi:calendar-check",...a.description?{description:a.description}:{},...a.group_id?{group_id:a.group_id}:{}}),t+=1}catch(n){console.error("Failed to import task:",a.title,n),r.push(a.title)}this.dispatchEvent(new CustomEvent("csv-imported",{detail:{created:t,failures:r},bubbles:!0,composed:!0})),this._close()}_renderCsvSection(){let t=this.hass.language;return d`
            <div class="csv-section">
                <div class="csv-actions">
                    <ha-button appearance="plain" size="small" @click=${()=>this._fileInput?.click()}>
                        ${l("panel.dialog.templates.choose_csv",t)}
                    </ha-button>
                    <input type="file" accept=".csv,text/csv" hidden @change=${this._handleFilePicked} />
                    <span class="csv-hint">${l("panel.dialog.templates.csv_hint",t)}</span>
                </div>

                ${this._csvErrors.length?d`
                    <ul class="csv-errors">
                        ${this._csvErrors.map(r=>d`<li>${r}</li>`)}
                    </ul>
                `:_}

                ${this._csvRows?.length?d`
                    <div class="csv-preview">
                        <table>
                            <thead>
                                <tr>
                                    <th>${l("panel.dialog.templates.preview.title",t)}</th>
                                    <th>${l("panel.dialog.templates.preview.interval",t)}</th>
                                    <th>${l("panel.dialog.templates.preview.last_performed",t)}</th>
                                    <th>${l("panel.dialog.templates.preview.group",t)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this._csvRows.map(r=>d`
                                    <tr>
                                        <td>${r.title}</td>
                                        <td>${ct(r.interval_value,r.interval_type,t)}</td>
                                        <td>${r.last_performed??"\u2014"}</td>
                                        <td>${r.group_id??"\u2014"}</td>
                                    </tr>
                                `)}
                            </tbody>
                        </table>
                    </div>
                    <ha-button
                        class="import-button"
                        .disabled=${this._importing}
                        @click=${this._handleImport}
                    >
                        ${l("panel.dialog.templates.import_count",t,"{count}",this._csvRows.length)}
                    </ha-button>
                `:this._csvRows!==null&&!this._csvErrors.length?d`
                    <span class="csv-hint">${l("panel.dialog.templates.csv_empty",t)}</span>
                `:_}
            </div>
        `}render(){if(!this.hass||!this._open)return d``;let t=this.hass.language,r=this._filteredTemplates;return d`
            <ha-dialog
                open
                heading="${l("panel.dialog.templates.title",t)}"
                header-title="${l("panel.dialog.templates.title",t)}"
                @closed=${this._close}
            >
                <input
                    class="search-input"
                    type="search"
                    .value=${this._query}
                    placeholder=${l("panel.dialog.templates.search",t)}
                    @input=${a=>{this._query=a.target.value}}
                />

                <div class="template-list">
                    ${Xr.map(a=>{let n=r.filter(o=>o.category===a);return n.length?d`
                            <div class="category-header">
                                ${l(`templates.categories.${a}`,t)}
                            </div>
                            ${n.map(o=>d`
                                <button class="template-row" @click=${()=>this._selectTemplate(o)}>
                                    <ha-icon .icon=${o.icon}></ha-icon>
                                    <span class="template-text">
                                        <span class="template-title">${o.title}</span>
                                        <span class="template-detail">
                                            ${ct(o.interval_value,o.interval_type,t)} — ${o.description}
                                        </span>
                                    </span>
                                </button>
                            `)}
                        `:_})}
                    ${r.length===0?d`
                        <span class="csv-hint">${l("panel.dialog.templates.no_matches",t)}</span>
                    `:_}
                </div>

                <div class="section-label">${l("panel.dialog.templates.import_csv",t)}</div>
                ${this._renderCsvSection()}

                ${B(d`
                    <ha-button data-dialog="close" appearance="plain" slot="secondaryAction" @click=${this._close}>
                        ${l("common.cancel",t)}
                    </ha-button>
                `)}
            </ha-dialog>
        `}};O.styles=[N,D`
        ha-dialog {
            --mdc-dialog-min-width: min(720px, 95vw);
        }

        .search-input {
            width: 100%;
            box-sizing: border-box;
            padding: 10px 12px;
            border: 1px solid var(--divider-color);
            border-radius: 8px;
            background: var(--card-background-color);
            color: var(--primary-text-color);
            font: inherit;
        }

        .search-input:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: -1px;
        }

        .template-list {
            max-height: 320px;
            overflow-y: auto;
            margin-top: 8px;
            border: 1px solid var(--divider-color);
            border-radius: 8px;
        }

        .category-header {
            position: sticky;
            top: 0;
            padding: 6px 12px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: var(--secondary-text-color);
            background: var(--secondary-background-color);
        }

        .template-row {
            display: flex;
            gap: 12px;
            align-items: center;
            width: 100%;
            padding: 8px 12px;
            border: none;
            background: none;
            color: var(--primary-text-color);
            text-align: left;
            font: inherit;
            cursor: pointer;
        }

        .template-row:hover {
            background: var(--secondary-background-color);
        }

        .template-row ha-icon {
            color: var(--secondary-text-color);
            flex-shrink: 0;
        }

        .template-text {
            display: flex;
            flex-direction: column;
            min-width: 0;
        }

        .template-detail {
            font-size: 12px;
            color: var(--secondary-text-color);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .section-label {
            font-weight: 500;
            color: var(--secondary-text-color);
            margin: 20px 0 8px;
        }

        .csv-actions {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
        }

        .csv-hint {
            font-size: 12px;
            color: var(--secondary-text-color);
        }

        .csv-errors {
            margin: 8px 0 0;
            padding-left: 18px;
            font-size: 13px;
            color: var(--error-color, #b71c1c);
        }

        .csv-preview {
            max-height: 200px;
            overflow: auto;
            margin-top: 8px;
            border: 1px solid var(--divider-color);
            border-radius: 8px;
        }

        .csv-preview table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }

        .csv-preview th,
        .csv-preview td {
            padding: 6px 10px;
            text-align: left;
            border-bottom: 1px solid var(--divider-color);
            white-space: nowrap;
        }

        .csv-preview th {
            position: sticky;
            top: 0;
            background: var(--secondary-background-color);
        }

        .import-button {
            margin-top: 12px;
        }
    `],h([x()],O.prototype,"hass",2),h([b()],O.prototype,"_open",2),h([b()],O.prototype,"_query",2),h([b()],O.prototype,"_csvRows",2),h([b()],O.prototype,"_csvErrors",2),h([b()],O.prototype,"_importing",2),h([R('input[type="file"]')],O.prototype,"_fileInput",2);customElements.get("hm-template-dialog")||customElements.define("hm-template-dialog",O);var mo=300,go=880,Yr="tasks.panel.group_by",fo=()=>{try{return localStorage.getItem(Yr)==="group"?"group":"status"}catch{return"status"}},_o=e=>e&&/^[a-z-]+$/.test(e)?`var(--${e}-color)`:e||"var(--primary-color)",z=class extends A{constructor(){super(...arguments);this._loaded=!1;this.tasks=[];this.groups=[];this.config=null;this.registry=[];this.labelRegistry=[];this._selectedLabels=[];this._groupFilter=null;this._groupBy=fo();this._wide=!0;this._groupsDialogOpen=!1;this._reload=new lt(()=>this._loadData(),mo);this._resizeObserver=new ResizeObserver(t=>{let a=(t[0]?.contentRect.width??0)>=go;a!==this._wide&&(this._wide=a)})}connectedCallback(){super.connectedCallback(),this._resizeObserver.observe(this),this._initialize()}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver.disconnect(),this._reload.cancel(),this._unsubscribe?.(),this._unsubscribe=void 0}willUpdate(t){if((t.has("tasks")||t.has("groups"))&&this._groupFilter!==null){let r=this._groupFilter;(r===""?this.tasks.some(n=>!n.group_id?.trim()):this.groups.includes(r))||(this._groupFilter=null)}}async _initialize(){await or(),this.config=await $r(this.hass),await this._loadData(),this._loaded=!0,this._openEditFromUrl();try{this._unsubscribe=await Cr(this.hass,()=>this._reload.schedule())}catch(t){console.error("Failed to subscribe to task updates:",t)}}async _loadData(){let[t,r,a,n]=await Promise.all([br(this.hass),Tr(this.hass),vr(this.hass),yr(this.hass)]);this.tasks=t,this.groups=r,this.registry=a,this.labelRegistry=n}async _openEditFromUrl(){let t=new URL(window.location.href),r=t.searchParams.get("edit");r&&(t.searchParams.delete("edit"),history.replaceState(history.state,"",t.pathname+t.search+t.hash),!(!this._canManage||!this.tasks.some(a=>a.id===r))&&(await this.updateComplete,this._editDialog?.open(r)))}_handleMove(t){let r=this.tasks.find(a=>a.id===t.detail.taskId);r&&this._moveDialog?.open(r)}_handleTaskAdded(t){$(this,l("card.add_task.added",this.hass.language,"{title}",t.detail?.title??""))}_handleTemplateSelected(t){let r=t.detail.template;this._addDialog?.open({title:r.title,description:r.description,trigger_type:"time",interval_value:r.interval_value,interval_type:r.interval_type,icon:r.icon})}_handleCsvImported(t){let{created:r,failures:a}=t.detail;$(this,l("panel.dialog.templates.imported",this.hass.language,"{count}",r)),a.length&&$(this,l("panel.dialog.templates.import_failed",this.hass.language,"{titles}",a.join(", ")))}_handleExportCsv(){let t=new Blob([_r(this.tasks)],{type:"text/csv"}),r=URL.createObjectURL(t),a=document.createElement("a");a.href=r,a.download="tasks.csv",a.click(),URL.revokeObjectURL(r)}_handleGroupByChanged(t){this._groupBy=t.detail.groupBy;try{localStorage.setItem(Yr,this._groupBy)}catch{}}_toggleLabel(t){this._selectedLabels=this._selectedLabels.includes(t)?this._selectedLabels.filter(r=>r!==t):[...this._selectedLabels,t]}get _visibleTasks(){let t=this._visibleCache;if(t&&t.tasks===this.tasks&&t.registry===this.registry&&t.labels===this._selectedLabels)return t.result;let r=ut(this.tasks,this.registry,"",this._selectedLabels);return this._visibleCache={tasks:this.tasks,registry:this.registry,labels:this._selectedLabels,result:r},r}get _labelsInUse(){let t=this._labelsInUseCache;if(t&&t.tasks===this.tasks&&t.registry===this.registry&&t.labelRegistry===this.labelRegistry)return t.result;let r=new Set,a=new Set(this.tasks.map(o=>o.id));this.registry.forEach(o=>{a.has(o.unique_id)&&o.labels.forEach(s=>r.add(s))});let n=this.labelRegistry.filter(o=>r.has(o.label_id));return this._labelsInUseCache={tasks:this.tasks,registry:this.registry,labelRegistry:this.labelRegistry,result:n},n}get _labelsByTask(){let t=this._labelsByTaskCache;if(t&&t.registry===this.registry&&t.labelRegistry===this.labelRegistry)return t.result;let r=new Map(this.labelRegistry.map(n=>[n.label_id,n])),a=new Map;return this.registry.forEach(n=>{if(n.platform!=="tasks"||!n.labels.length)return;let o=n.labels.map(s=>r.get(s)).filter(s=>!!s);o.length&&a.set(n.unique_id,o)}),this._labelsByTaskCache={registry:this.registry,labelRegistry:this.labelRegistry,result:a},a}get _canManage(){return!!this.hass?.user?.is_admin}get _dueSoonDays(){return this.config?.due_soon_days??14}get _heading(){let t=this.hass.language;return this._groupFilter===null?l("panel.nav.all_tasks",t):this._groupFilter===""?l("common.ungrouped",t):this._groupFilter}render(){if(!this.hass)return d``;if(!this._loaded)return d`<p class="loading">${l("common.loading",this.hass.language)}</p>`;let t=this.hass.language,r=this._wide,a=this._canManage;return d`
            <div class="header">
                <div class="toolbar ${r?"":"compact"}">
                    <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
                    <div class="main-title">${this.config?.options.sidebar_title}</div>
                    ${a?this._renderToolbarButton("mdi:book-open-variant-outline",l("panel.cards.current.filter.templates",t),()=>this._templateDialog?.open()):_}
                    ${this._renderToolbarButton("mdi:tray-arrow-down",l("panel.cards.current.filter.export",t),this._handleExportCsv)}
                    ${r||!a?_:this._renderToolbarButton("mdi:folder-cog-outline",l("panel.toolbar.manage_groups",t),()=>this._groupsDialogOpen=!0)}
                </div>
            </div>

            <div class="view ${r?"wide":""}">
                <div class="layout">
                    ${r?d`
                        <ha-card class="nav-card">
                            <hm-group-nav
                                .hass=${this.hass}
                                .groups=${this.groups}
                                .tasks=${this.tasks}
                                .dueSoonDays=${this._dueSoonDays}
                                .selected=${this._groupFilter}
                                .readonly=${!a}
                                @group-selected=${n=>this._groupFilter=n.detail.group}
                            ></hm-group-nav>
                        </ha-card>
                    `:_}
                    <ha-card class="list-card">
                        ${this.tasks.length?this._renderList():this._renderOnboarding()}
                    </ha-card>
                </div>
            </div>

            ${a?this._renderManagement():_}
        `}_renderManagement(){let t=this.hass.language;return d`
            <button class="fab" @click=${()=>this._addDialog?.open()}>
                <ha-icon icon="mdi:plus"></ha-icon>
                <span>${l("panel.toolbar.add_task",t)}</span>
            </button>

            <hm-add-task-dialog
                .hass=${this.hass}
                .groups=${this.groups}
                @task-added=${this._handleTaskAdded}
                @browse-templates=${()=>this._templateDialog?.open()}
            ></hm-add-task-dialog>
            <hm-edit-dialog
                .hass=${this.hass}
                .registry=${this.registry}
                .labelRegistry=${this.labelRegistry}
                .groups=${this.groups}
            ></hm-edit-dialog>
            <hm-move-dialog .hass=${this.hass} .groups=${this.groups}></hm-move-dialog>
            <hm-template-dialog
                .hass=${this.hass}
                @template-selected=${this._handleTemplateSelected}
                @csv-imported=${this._handleCsvImported}
            ></hm-template-dialog>
            ${this._groupsDialogOpen?this._renderGroupsDialog():_}
        `}_renderToolbarButton(t,r,a){return d`
            <button
                class="toolbar-button ${this._wide?"":"icon-only"}"
                @click=${a}
                title=${r}
                aria-label=${r}
            >
                <ha-icon .icon=${t}></ha-icon>
                ${this._wide?d`<span>${r}</span>`:_}
            </button>
        `}_renderList(){let t=this.hass.language,r=this._labelsInUse;return d`
            <hm-task-list
                .hass=${this.hass}
                .tasks=${this._visibleTasks}
                .groups=${this.groups}
                .heading=${this._heading}
                .dueSoonDays=${this._dueSoonDays}
                .searchMode=${this._wide?"header":"toggle"}
                .showGroupChips=${!this._wide}
                .readonly=${!this._canManage}
                .groupFilter=${this._groupFilter}
                .groupBy=${this._groupBy}
                .labelsByTask=${this._labelsByTask}
                @group-filter-changed=${a=>this._groupFilter=a.detail.group}
                @group-by-changed=${this._handleGroupByChanged}
                @task-edit=${a=>this._editDialog?.open(a.detail.taskId)}
                @task-move=${this._handleMove}
            >
                ${r.length?d`
                    <div slot="filters" class="label-filters">
                        ${r.map(a=>{let n=this._selectedLabels.includes(a.label_id);return d`
                                <button
                                    class="label-filter ${n?"selected":""}"
                                    style=${`--label-color: ${_o(a.color)}`}
                                    aria-pressed=${n?"true":"false"}
                                    @click=${()=>this._toggleLabel(a.label_id)}
                                >
                                    <ha-icon .icon=${a.icon||"mdi:label-outline"}></ha-icon>
                                    ${a.name}
                                </button>
                            `})}
                        ${this._selectedLabels.length?d`
                            <button class="label-filter clear" @click=${()=>this._selectedLabels=[]}>
                                ${l("panel.cards.current.filter.clear",t)}
                            </button>
                        `:_}
                    </div>
                `:_}
            </hm-task-list>
        `}_renderOnboarding(){let t=this.hass.language;return d`
            <div class="onboarding">
                <div class="onboarding-icon"><ha-icon icon="mdi:home-heart"></ha-icon></div>
                <h2>${l("panel.empty.title",t)}</h2>
                ${this._canManage?d`
                    <p>${l("panel.empty.message",t)}</p>
                    <div class="onboarding-actions">
                        <button class="primary-button" @click=${()=>this._addDialog?.open()}>
                            <ha-icon icon="mdi:plus"></ha-icon>
                            ${l("panel.toolbar.add_task",t)}
                        </button>
                        <button class="secondary-button" @click=${()=>this._templateDialog?.open()}>
                            <ha-icon icon="mdi:book-open-variant-outline"></ha-icon>
                            ${l("panel.cards.current.filter.templates",t)}
                        </button>
                    </div>
                `:d`
                    <p>${l("panel.empty.message_readonly",t)}</p>
                `}
            </div>
        `}_renderGroupsDialog(){let t=this.hass.language,r=()=>this._groupsDialogOpen=!1;return d`
            <ha-dialog
                open
                heading=${l("panel.toolbar.manage_groups",t)}
                header-title=${l("panel.toolbar.manage_groups",t)}
                @closed=${a=>{a.target===a.currentTarget&&r()}}
            >
                <hm-group-nav
                    .hass=${this.hass}
                    .groups=${this.groups}
                    .tasks=${this.tasks}
                    .dueSoonDays=${this._dueSoonDays}
                    manageOnly
                ></hm-group-nav>
                ${B(d`
                    <ha-button slot="primaryAction" data-dialog="close" @click=${r}>
                        ${l("panel.nav.done_editing",t)}
                    </ha-button>
                `)}
            </ha-dialog>
        `}};z.styles=[N,ye,D`
        :host {
            display: block;
        }

        .loading {
            padding: 24px;
        }

        /* Toolbar */
        .toolbar {
            gap: 4px;
        }

        .main-title {
            min-width: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .toolbar.compact .main-title {
            margin-left: 12px;
        }

        .toolbar-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            height: 40px;
            padding: 0 14px 0 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            white-space: nowrap;
            transition: background-color 0.15s;
            --mdc-icon-size: 20px;
        }

        .toolbar-button.icon-only {
            justify-content: center;
            width: 40px;
            padding: 0;
        }

        .toolbar-button:hover {
            background: color-mix(in srgb, currentColor 10%, transparent);
        }

        /* Page layout: sidebar + list when wide, one column when narrow. */
        .view {
            display: block;
            padding: 8px 8px 96px;
            box-sizing: border-box;
        }

        .view.wide {
            padding: 24px 24px 104px;
        }

        .layout {
            display: grid;
            gap: 24px;
            max-width: 1280px;
            margin: 0 auto;
        }

        .view.wide .layout {
            grid-template-columns: 264px minmax(0, 1fr);
            align-items: start;
        }

        ha-card {
            margin: 0;
        }

        .nav-card {
            position: sticky;
            top: 0;
            padding: 8px;
        }

        .list-card {
            overflow: hidden;
            padding-bottom: 8px;
        }

        /* Label filters, slotted into the task list's toolbar row */
        .label-filters {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 6px;
        }

        .label-filter {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            height: 28px;
            padding: 0 10px 0 8px;
            border-radius: 14px;
            border: 1px solid var(--divider-color);
            font-size: 12.5px;
            font-weight: 500;
            color: var(--primary-text-color);
            transition: background-color 0.15s, border-color 0.15s;
            --mdc-icon-size: 16px;
        }

        .label-filter ha-icon {
            color: var(--label-color);
        }

        .label-filter:hover {
            background: var(--hm-subtle);
        }

        .label-filter.selected {
            background: color-mix(in srgb, var(--label-color) 18%, transparent);
            border-color: color-mix(in srgb, var(--label-color) 55%, transparent);
        }

        .label-filter.clear {
            padding: 0 10px;
            border-style: dashed;
            color: var(--secondary-text-color);
        }

        /* Add-task button, following Home Assistant's extended FAB pattern */
        .fab {
            position: fixed;
            right: 24px;
            bottom: calc(24px + env(safe-area-inset-bottom, 0px));
            z-index: 3;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            height: 56px;
            padding: 0 22px 0 18px;
            border-radius: 16px;
            background: var(--primary-color);
            color: var(--text-primary-color, #fff);
            font-size: 15px;
            font-weight: 500;
            box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.14), 0 1px 18px rgba(0, 0, 0, 0.12);
            transition: box-shadow 0.15s, transform 0.1s;
            --mdc-icon-size: 24px;
        }

        .fab:hover {
            box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
        }

        .fab:active {
            transform: scale(0.97);
        }

        /* First-run empty state */
        .onboarding {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 56px 24px 64px;
            text-align: center;
        }

        .onboarding-icon {
            display: grid;
            place-items: center;
            width: 72px;
            height: 72px;
            margin-bottom: 8px;
            border-radius: 22px;
            background: color-mix(in srgb, var(--primary-color) 14%, transparent);
            color: var(--primary-color);
            --mdc-icon-size: 40px;
        }

        .onboarding h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
        }

        .onboarding p {
            max-width: 420px;
            margin: 0;
            line-height: 1.5;
            color: var(--secondary-text-color);
        }

        .onboarding-actions {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 12px;
            margin-top: 16px;
        }

        .primary-button,
        .secondary-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            height: 40px;
            padding: 0 20px 0 14px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            --mdc-icon-size: 20px;
        }

        .primary-button {
            background: var(--primary-color);
            color: var(--text-primary-color, #fff);
        }

        .secondary-button {
            border: 1px solid var(--divider-color);
            color: var(--primary-color);
        }

        .secondary-button:hover {
            background: color-mix(in srgb, var(--primary-color) 8%, transparent);
        }
    `],h([x()],z.prototype,"hass",2),h([x()],z.prototype,"narrow",2),h([b()],z.prototype,"_loaded",2),h([b()],z.prototype,"tasks",2),h([b()],z.prototype,"groups",2),h([b()],z.prototype,"config",2),h([b()],z.prototype,"registry",2),h([b()],z.prototype,"labelRegistry",2),h([b()],z.prototype,"_selectedLabels",2),h([b()],z.prototype,"_groupFilter",2),h([b()],z.prototype,"_groupBy",2),h([b()],z.prototype,"_wide",2),h([b()],z.prototype,"_groupsDialogOpen",2),h([R("hm-add-task-dialog")],z.prototype,"_addDialog",2),h([R("hm-edit-dialog")],z.prototype,"_editDialog",2),h([R("hm-move-dialog")],z.prototype,"_moveDialog",2),h([R("hm-template-dialog")],z.prototype,"_templateDialog",2);customElements.define("tasks-panel",z);export{z as TasksPanel};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
lit-html/directive.js:
lit-html/directives/repeat.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
