var Vt=Object.defineProperty;var wr=Object.getOwnPropertyDescriptor;var O=(t,i)=>{for(var e in i)Vt(t,e,{get:i[e],enumerable:!0})};var p=(t,i,e,r)=>{for(var a=r>1?void 0:r?wr(i,e):i,n=t.length-1,o;n>=0;n--)(o=t[n])&&(a=(r?o(i,e,a):o(a))||a);return r&&a&&Vt(i,e,a),a};var Ae=globalThis,Ce=Ae.ShadowRoot&&(Ae.ShadyCSS===void 0||Ae.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ct=Symbol(),qt=new WeakMap,ge=class{constructor(i,e,r){if(this._$cssResult$=!0,r!==ct)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=e}get styleSheet(){let i=this.o,e=this.t;if(Ce&&i===void 0){let r=e!==void 0&&e.length===1;r&&(i=qt.get(e)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),r&&qt.set(e,i))}return i}toString(){return this.cssText}},Wt=t=>new ge(typeof t=="string"?t:t+"",void 0,ct),S=(t,...i)=>{let e=t.length===1?t[0]:i.reduce((r,a,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+t[n+1],t[0]);return new ge(e,t,ct)},Zt=(t,i)=>{if(Ce)t.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of i){let r=document.createElement("style"),a=Ae.litNonce;a!==void 0&&r.setAttribute("nonce",a),r.textContent=e.cssText,t.appendChild(r)}},dt=Ce?t=>t:t=>t instanceof CSSStyleSheet?(i=>{let e="";for(let r of i.cssRules)e+=r.cssText;return Wt(e)})(t):t;var{is:xr,defineProperty:kr,getOwnPropertyDescriptor:Tr,getOwnPropertyNames:Er,getOwnPropertySymbols:$r,getPrototypeOf:Sr}=Object,U=globalThis,Xt=U.trustedTypes,Ar=Xt?Xt.emptyScript:"",Cr=U.reactiveElementPolyfillSupport,fe=(t,i)=>t,_e={toAttribute(t,i){switch(i){case Boolean:t=t?Ar:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,i){let e=t;switch(i){case Boolean:e=t!==null;break;case Number:e=t===null?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch{e=null}}return e}},De=(t,i)=>!xr(t,i),Yt={attribute:!0,type:String,converter:_e,reflect:!1,useDefault:!1,hasChanged:De};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),U.litPropertyMetadata??(U.litPropertyMetadata=new WeakMap);var B=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??(this.l=[])).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,e=Yt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(i,e),!e.noAccessor){let r=Symbol(),a=this.getPropertyDescriptor(i,r,e);a!==void 0&&kr(this.prototype,i,a)}}static getPropertyDescriptor(i,e,r){let{get:a,set:n}=Tr(this.prototype,i)??{get(){return this[e]},set(o){this[e]=o}};return{get:a,set(o){let l=a?.call(this);n?.call(this,o),this.requestUpdate(i,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??Yt}static _$Ei(){if(this.hasOwnProperty(fe("elementProperties")))return;let i=Sr(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(fe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(fe("properties"))){let e=this.properties,r=[...Er(e),...$r(e)];for(let a of r)this.createProperty(a,e[a])}let i=this[Symbol.metadata];if(i!==null){let e=litPropertyMetadata.get(i);if(e!==void 0)for(let[r,a]of e)this.elementProperties.set(r,a)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let a=this._$Eu(e,r);a!==void 0&&this._$Eh.set(a,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){let e=[];if(Array.isArray(i)){let r=new Set(i.flat(1/0).reverse());for(let a of r)e.unshift(dt(a))}else i!==void 0&&e.push(dt(i));return e}static _$Eu(i,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??(this._$EO=new Set)).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){let i=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(i.set(r,this[r]),delete this[r]);i.size>0&&(this._$Ep=i)}createRenderRoot(){let i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Zt(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,e,r){this._$AK(i,r)}_$ET(i,e){let r=this.constructor.elementProperties.get(i),a=this.constructor._$Eu(i,r);if(a!==void 0&&r.reflect===!0){let n=(r.converter?.toAttribute!==void 0?r.converter:_e).toAttribute(e,r.type);this._$Em=i,n==null?this.removeAttribute(a):this.setAttribute(a,n),this._$Em=null}}_$AK(i,e){let r=this.constructor,a=r._$Eh.get(i);if(a!==void 0&&this._$Em!==a){let n=r.getPropertyOptions(a),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:_e;this._$Em=a;let l=o.fromAttribute(e,n.type);this[a]=l??this._$Ej?.get(a)??l,this._$Em=null}}requestUpdate(i,e,r,a=!1,n){if(i!==void 0){let o=this.constructor;if(a===!1&&(n=this[i]),r??(r=o.getPropertyOptions(i)),!((r.hasChanged??De)(n,e)||r.useDefault&&r.reflect&&n===this._$Ej?.get(i)&&!this.hasAttribute(o._$Eu(i,r))))return;this.C(i,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,e,{useDefault:r,reflect:a,wrapped:n},o){r&&!(this._$Ej??(this._$Ej=new Map)).has(i)&&(this._$Ej.set(i,o??e??this[i]),n!==!0||o!==void 0)||(this._$AL.has(i)||(this.hasUpdated||r||(e=void 0),this._$AL.set(i,e)),a===!0&&this._$Em!==i&&(this._$Eq??(this._$Eq=new Set)).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[a,n]of this._$Ep)this[a]=n;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[a,n]of r){let{wrapped:o}=n,l=this[a];o!==!0||this._$AL.has(a)||l===void 0||this.C(a,void 0,n,l)}}let i=!1,e=this._$AL;try{i=this.shouldUpdate(e),i?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw i=!1,this._$EM(),r}i&&this._$AE(e)}willUpdate(i){}_$AE(i){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(i){}firstUpdated(i){}};B.elementStyles=[],B.shadowRootOptions={mode:"open"},B[fe("elementProperties")]=new Map,B[fe("finalized")]=new Map,Cr?.({ReactiveElement:B}),(U.reactiveElementVersions??(U.reactiveElementVersions=[])).push("2.1.2");var ve=globalThis,Jt=t=>t,ze=ve.trustedTypes,Qt=ze?ze.createPolicy("lit-html",{createHTML:t=>t}):void 0,ht="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,pt="?"+N,Dr=`<${pt}>`,te=document,be=()=>te.createComment(""),we=t=>t===null||typeof t!="object"&&typeof t!="function",mt=Array.isArray,ai=t=>mt(t)||typeof t?.[Symbol.iterator]=="function",ut=`[ 	
\f\r]`,ye=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Kt=/-->/g,ei=/>/g,K=RegExp(`>|${ut}(?:([^\\s"'>=/]+)(${ut}*=${ut}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ti=/'/g,ii=/"/g,ni=/^(?:script|style|textarea|title)$/i,gt=t=>(i,...e)=>({_$litType$:t,strings:i,values:e}),d=gt(1),oi=gt(2),Kn=gt(3),P=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),ri=new WeakMap,ee=te.createTreeWalker(te,129);function si(t,i){if(!mt(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Qt!==void 0?Qt.createHTML(i):i}var li=(t,i)=>{let e=t.length-1,r=[],a,n=i===2?"<svg>":i===3?"<math>":"",o=ye;for(let l=0;l<e;l++){let s=t[l],m,g,u=-1,_=0;for(;_<s.length&&(o.lastIndex=_,g=o.exec(s),g!==null);)_=o.lastIndex,o===ye?g[1]==="!--"?o=Kt:g[1]!==void 0?o=ei:g[2]!==void 0?(ni.test(g[2])&&(a=RegExp("</"+g[2],"g")),o=K):g[3]!==void 0&&(o=K):o===K?g[0]===">"?(o=a??ye,u=-1):g[1]===void 0?u=-2:(u=o.lastIndex-g[2].length,m=g[1],o=g[3]===void 0?K:g[3]==='"'?ii:ti):o===ii||o===ti?o=K:o===Kt||o===ei?o=ye:(o=K,a=void 0);let y=o===K&&t[l+1].startsWith("/>")?" ":"";n+=o===ye?s+Dr:u>=0?(r.push(m),s.slice(0,u)+ht+s.slice(u)+N+y):s+N+(u===-2?l:y)}return[si(t,n+(t[e]||"<?>")+(i===2?"</svg>":i===3?"</math>":"")),r]},xe=class t{constructor({strings:i,_$litType$:e},r){let a;this.parts=[];let n=0,o=0,l=i.length-1,s=this.parts,[m,g]=li(i,e);if(this.el=t.createElement(m,r),ee.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(a=ee.nextNode())!==null&&s.length<l;){if(a.nodeType===1){if(a.hasAttributes())for(let u of a.getAttributeNames())if(u.endsWith(ht)){let _=g[o++],y=a.getAttribute(u).split(N),b=/([.?@])?(.*)/.exec(_);s.push({type:1,index:n,name:b[2],strings:y,ctor:b[1]==="."?Re:b[1]==="?"?He:b[1]==="@"?Le:re}),a.removeAttribute(u)}else u.startsWith(N)&&(s.push({type:6,index:n}),a.removeAttribute(u));if(ni.test(a.tagName)){let u=a.textContent.split(N),_=u.length-1;if(_>0){a.textContent=ze?ze.emptyScript:"";for(let y=0;y<_;y++)a.append(u[y],be()),ee.nextNode(),s.push({type:2,index:++n});a.append(u[_],be())}}}else if(a.nodeType===8)if(a.data===pt)s.push({type:2,index:n});else{let u=-1;for(;(u=a.data.indexOf(N,u+1))!==-1;)s.push({type:7,index:n}),u+=N.length-1}n++}}static createElement(i,e){let r=te.createElement("template");return r.innerHTML=i,r}};function ie(t,i,e=t,r){if(i===P)return i;let a=r!==void 0?e._$Co?.[r]:e._$Cl,n=we(i)?void 0:i._$litDirective$;return a?.constructor!==n&&(a?._$AO?.(!1),n===void 0?a=void 0:(a=new n(t),a._$AT(t,e,r)),r!==void 0?(e._$Co??(e._$Co=[]))[r]=a:e._$Cl=a),a!==void 0&&(i=ie(t,a._$AS(t,i.values),a,r)),i}var Ie=class{constructor(i,e){this._$AV=[],this._$AN=void 0,this._$AD=i,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(i){let{el:{content:e},parts:r}=this._$AD,a=(i?.creationScope??te).importNode(e,!0);ee.currentNode=a;let n=ee.nextNode(),o=0,l=0,s=r[0];for(;s!==void 0;){if(o===s.index){let m;s.type===2?m=new le(n,n.nextSibling,this,i):s.type===1?m=new s.ctor(n,s.name,s.strings,this,i):s.type===6&&(m=new Be(n,this,i)),this._$AV.push(m),s=r[++l]}o!==s?.index&&(n=ee.nextNode(),o++)}return ee.currentNode=te,a}p(i){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(i,r,e),e+=r.strings.length-2):r._$AI(i[e])),e++}},le=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(i,e,r,a){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=i,this._$AB=e,this._$AM=r,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let i=this._$AA.parentNode,e=this._$AM;return e!==void 0&&i?.nodeType===11&&(i=e.parentNode),i}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(i,e=this){i=ie(this,i,e),we(i)?i===f||i==null||i===""?(this._$AH!==f&&this._$AR(),this._$AH=f):i!==this._$AH&&i!==P&&this._(i):i._$litType$!==void 0?this.$(i):i.nodeType!==void 0?this.T(i):ai(i)?this.k(i):this._(i)}O(i){return this._$AA.parentNode.insertBefore(i,this._$AB)}T(i){this._$AH!==i&&(this._$AR(),this._$AH=this.O(i))}_(i){this._$AH!==f&&we(this._$AH)?this._$AA.nextSibling.data=i:this.T(te.createTextNode(i)),this._$AH=i}$(i){let{values:e,_$litType$:r}=i,a=typeof r=="number"?this._$AC(i):(r.el===void 0&&(r.el=xe.createElement(si(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===a)this._$AH.p(e);else{let n=new Ie(a,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(i){let e=ri.get(i.strings);return e===void 0&&ri.set(i.strings,e=new xe(i)),e}k(i){mt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,a=0;for(let n of i)a===e.length?e.push(r=new t(this.O(be()),this.O(be()),this,this.options)):r=e[a],r._$AI(n),a++;a<e.length&&(this._$AR(r&&r._$AB.nextSibling,a),e.length=a)}_$AR(i=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);i!==this._$AB;){let r=Jt(i).nextSibling;Jt(i).remove(),i=r}}setConnected(i){this._$AM===void 0&&(this._$Cv=i,this._$AP?.(i))}},re=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(i,e,r,a,n){this.type=1,this._$AH=f,this._$AN=void 0,this.element=i,this.name=e,this._$AM=a,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=f}_$AI(i,e=this,r,a){let n=this.strings,o=!1;if(n===void 0)i=ie(this,i,e,0),o=!we(i)||i!==this._$AH&&i!==P,o&&(this._$AH=i);else{let l=i,s,m;for(i=n[0],s=0;s<n.length-1;s++)m=ie(this,l[r+s],e,s),m===P&&(m=this._$AH[s]),o||(o=!we(m)||m!==this._$AH[s]),m===f?i=f:i!==f&&(i+=(m??"")+n[s+1]),this._$AH[s]=m}o&&!a&&this.j(i)}j(i){i===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,i??"")}},Re=class extends re{constructor(){super(...arguments),this.type=3}j(i){this.element[this.name]=i===f?void 0:i}},He=class extends re{constructor(){super(...arguments),this.type=4}j(i){this.element.toggleAttribute(this.name,!!i&&i!==f)}},Le=class extends re{constructor(i,e,r,a,n){super(i,e,r,a,n),this.type=5}_$AI(i,e=this){if((i=ie(this,i,e,0)??f)===P)return;let r=this._$AH,a=i===f&&r!==f||i.capture!==r.capture||i.once!==r.once||i.passive!==r.passive,n=i!==f&&(r===f||a);a&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,i),this._$AH=i}handleEvent(i){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,i):this._$AH.handleEvent(i)}},Be=class{constructor(i,e,r){this.element=i,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(i){ie(this,i)}},ci={M:ht,P:N,A:pt,C:1,L:li,R:Ie,D:ai,V:ie,I:le,H:re,N:He,U:Le,B:Re,F:Be},zr=ve.litHtmlPolyfillSupport;zr?.(xe,le),(ve.litHtmlVersions??(ve.litHtmlVersions=[])).push("3.3.3");var di=(t,i,e)=>{let r=e?.renderBefore??i,a=r._$litPart$;if(a===void 0){let n=e?.renderBefore??null;r._$litPart$=a=new le(i.insertBefore(be(),n),n,void 0,e??{})}return a._$AI(t),a};var ke=globalThis,T=class extends B{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;let i=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=i.firstChild),i}update(i){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=di(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return P}};T._$litElement$=!0,T.finalized=!0,ke.litElementHydrateSupport?.({LitElement:T});var Ir=ke.litElementPolyfillSupport;Ir?.({LitElement:T});(ke.litElementVersions??(ke.litElementVersions=[])).push("4.2.2");var Rr={attribute:!0,type:String,converter:_e,reflect:!1,hasChanged:De},Hr=(t=Rr,i,e)=>{let{kind:r,metadata:a}=e,n=globalThis.litPropertyMetadata.get(a);if(n===void 0&&globalThis.litPropertyMetadata.set(a,n=new Map),r==="setter"&&((t=Object.create(t)).wrapped=!0),n.set(e.name,t),r==="accessor"){let{name:o}=e;return{set(l){let s=i.get.call(this);i.set.call(this,l),this.requestUpdate(o,s,t,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,t,l),l}}}if(r==="setter"){let{name:o}=e;return function(l){let s=this[o];i.call(this,l),this.requestUpdate(o,s,t,!0,l)}}throw Error("Unsupported decorator location: "+r)};function w(t){return(i,e)=>typeof e=="object"?Hr(t,i,e):((r,a,n)=>{let o=a.hasOwnProperty(n);return a.constructor.createProperty(n,r),o?Object.getOwnPropertyDescriptor(a,n):void 0})(t,i,e)}function v(t){return w({...t,state:!0,attribute:!1})}var ae=(t,i,e)=>(e.configurable=!0,e.enumerable=!0,Reflect.decorate&&typeof i!="object"&&Object.defineProperty(t,i,e),e);function D(t,i){return(e,r,a)=>{let n=o=>o.renderRoot?.querySelector(t)??null;if(i){let{get:o,set:l}=typeof r=="object"?e:a??(()=>{let s=Symbol();return{get(){return this[s]},set(m){this[s]=m}}})();return ae(e,r,{get(){let s=o.call(this);return s===void 0&&(s=n(this),(s!==null||this.hasUpdated)&&l.call(this,s)),s}})}return ae(e,r,{get(){return n(this)}})}}var ft={};O(ft,{card:()=>Fr,common:()=>Lr,default:()=>Ur,intervals:()=>Br,notifications:()=>Pr,panel:()=>Mr,templates:()=>Or,trigger_types:()=>Nr});var Lr={loading:"Loading...",none:"None",no_tasks:"No tasks found.",ungrouped:"Ungrouped",cancel:"Cancel",invalid_date:"Invalid date entered."},Br={day:"Day",days:"Days",week:"Week",weeks:"Weeks",month:"Month",months:"Months",year:"Year",years:"Years",every_uses:"Every {value} uses",every_runtime:"Every {value} runtime"},Nr={time:"Time-based",date:"Fixed date",count:"Count-based",runtime:"Runtime-based"},Pr={when:{due:"Due",overdue:"Overdue",due_and_overdue:"Due and overdue"}},Fr={add_task:{added:'"{title}" added.',admin_only:"Only administrators can add tasks."}},Mr={cards:{new:{title:"Create New Task",fields:{title:{heading:"Task Title"},interval_value:{heading:"Interval"},interval_type:{heading:"Interval Type"},last_performed:{heading:"Last Performed",helper:"Leave blank to use today"},anchor_date:{heading:"Anchor date",helper:"The schedule repeats from this fixed date"},tag:{heading:"Tag"},icon:{heading:"Icon"},label:{heading:"Label(s)"},area:{heading:"Area"},description:{heading:"Description"},trigger_type:{heading:"Trigger type"},count_entity_id:{heading:"Counted entity"},count_threshold:{heading:"Count threshold"},runtime_entity_id:{heading:"Runtime sensor"},runtime_threshold:{heading:"Runtime threshold"},group_id:{heading:"Group",helper:"Pick a group or type a new name"},notifications_enabled:{heading:"Enable notifications"},notification_target:{heading:"Notify service",helper:"Leave empty to use notify.notify"},notify_when:{heading:"Notify when"},notify_days_before_due:{heading:"Days before due",helper:"Optional due-soon reminder offset"},notification_time:{heading:"Time of day",helper:"When automatic notifications are sent"},notification_url:{heading:"Open URL",helper:"Optional URL for the notification's Open action"},active_months:{heading:"Active months",helper:"Seasonal tasks are only due in these months (empty = year-round)"}},sections:{optional:"Optional settings",notifications:"Notifications"},actions:{add_task:"Add Task"},alerts:{required:"Please fill all fields",error:"Error adding task. See console for details."}},current:{next:"Next Due",actions:{edit:"Edit",move:"Move to group",remove:"Remove"},alerts:{complete_success:'"{title}" marked complete. The next due date was recalculated.',complete_error:"Failed to mark task complete. See console for details.",remove_error:"Failed to remove the task. See console for details."},filter:{search:"Search tasks...",templates:"Browse templates",export:"Export CSV",clear:"Clear filters"}},groups:{title:"Groups",fields:{new_group:{heading:"New group"}},actions:{create:"Create",rename:"Rename",delete:"Delete",save:"Save"},empty:"No groups yet. Create one to organize your tasks.",confirm_delete:'Delete group "{title}"? Its tasks move to Ungrouped.',alerts:{error:"Failed to create the group. Check the browser console and Home Assistant logs.",exists:'Group "{title}" already exists.',rename_error:"Failed to rename the group. See console for details.",delete_error:"Failed to delete the group. See console for details."},confirm_delete_title:"Delete Group"}},dialog:{edit_task:{title:"Edit Task",fields:{interval_value:{heading:"Interval"},interval_type:{heading:"Interval Type"},last_performed:{heading:"Last Performed",helper:"Leave blank to use today"},anchor_date:{heading:"Anchor date",helper:"The schedule repeats from this fixed date"},tag:{heading:"Tag"},icon:{heading:"Icon"},label:{heading:"Label(s)"},area:{heading:"Area"},trigger_type:{heading:"Trigger type"},count_entity_id:{heading:"Counted entity"},count_threshold:{heading:"Count threshold"},runtime_entity_id:{heading:"Runtime sensor"},runtime_threshold:{heading:"Runtime threshold"},title:{heading:"Title"},description:{heading:"Description"},group_id:{heading:"Group",helper:"Pick a group or type a new name"},notifications_enabled:{heading:"Enable notifications"},notification_target:{heading:"Notify service",helper:"Leave empty to use notify.notify"},notify_when:{heading:"Notify when"},notify_days_before_due:{heading:"Days before due",helper:"Optional due-soon reminder offset"},notification_time:{heading:"Time of day",helper:"When automatic notifications are sent"},notification_url:{heading:"Open URL",helper:"Optional URL for the notification's Open action"},active_months:{heading:"Active months",helper:"Seasonal tasks are only due in these months (empty = year-round)"}},sections:{optional:"Optional settings",notifications:"Notifications",history:"History"},actions:{cancel:"Cancel",save:"Save",test_notification:"Send test notification"},alerts:{error:"Failed to save changes. See console for details.",test_error:"Failed to send the test notification. See console for details."}},move_task:{title:"Move task",fields:{group_id:{heading:"Group"}},actions:{cancel:"Cancel",move:"Move"}},confirm_complete:{title:"Mark Task Complete",message:'Mark "{title}" as complete? Last performed will be reset to today and the next due date will be recalculated based on the {interval} interval.',message_progress:'Mark "{title}" as complete? Progress ({interval}) will start over.',note_label:"Note (optional)",actions:{confirm:"Mark Complete"}},confirm_remove:{title:"Remove Task",message:'Remove "{title}"? This cannot be undone.',actions:{confirm:"Remove"}},templates:{title:"Task Templates",search:"Search templates...",import_csv:"Import from CSV",choose_csv:"Choose CSV file",csv_hint:"Columns: title (required), description, interval_value, interval_type, last_performed (YYYY-MM-DD), icon, group_id",csv_empty:"No importable rows found in the file.",no_matches:"No templates match your search.",import_count:"{count, plural, one {Import 1 task} other {Import # tasks}}",imported:"{count, plural, one {1 task imported.} other {# tasks imported.}}",import_failed:"Failed to import: {titles}",preview:{title:"Title",interval:"Interval",last_performed:"Last performed",group:"Group"}}},toolbar:{add_task:"Add task",manage_groups:"Manage groups"},nav:{all_tasks:"All tasks",done_editing:"Done"},list:{due_today:"Due today",days_overdue:"{count, plural, one {1 day overdue} other {# days overdue}}",days_left:"{count, plural, one {Due in 1 day} other {# days left}}",search:"Search tasks...",all_groups:"All groups",overdue:"Overdue",due_soon:"Due soon",upcoming:"Upcoming",no_tasks:"No tasks found",done:"Done",last_performed:"Last Performed",progress:"Progress",history:"History",complete:"Complete",remove:"Remove",all_caught_up:"All caught up",needs_attention:"{count, plural, one {1 task needs attention} other {# tasks need attention}}",done_today:"Done today",repeats:"Repeats",next_due:"Next due {date}",clear_search:"Clear search",group_by:"Group by",by_status:"Status"},empty:{title:"No tasks yet",message:"Add your first task, or start from the template library of common household tasks.",message_readonly:"Tasks added by an administrator will show up here."}},Or={categories:{hvac:"HVAC",plumbing:"Plumbing",electrical:"Electrical",appliances:"Appliances",interior:"Interior",exterior:"Exterior",yard:"Yard & garden",safety:"Safety",vehicles:"Vehicles"}},Ur={common:Lr,intervals:Br,trigger_types:Nr,notifications:Pr,card:Fr,panel:Mr,templates:Or};var _t={};O(_t,{card:()=>Wr,common:()=>Gr,default:()=>Yr,intervals:()=>jr,notifications:()=>qr,panel:()=>Zr,templates:()=>Xr,trigger_types:()=>Vr});var Gr={loading:"Wird geladen...",none:"Keine",no_tasks:"Keine Aufgaben gefunden.",ungrouped:"Ohne Gruppe",cancel:"Abbrechen",invalid_date:"Ung\xFCltiges Datum eingegeben."},jr={day:"Tag",days:"Tage",week:"Woche",weeks:"Wochen",month:"Monat",months:"Monate",year:"Jahr",years:"Jahre",every_uses:"Alle {value} Nutzungen",every_runtime:"Alle {value} Laufzeit"},Vr={time:"Zeitbasiert",date:"Festes Datum",count:"Z\xE4hlerbasiert",runtime:"Laufzeitbasiert"},qr={when:{due:"F\xE4llig",overdue:"\xDCberf\xE4llig",due_and_overdue:"F\xE4llig und \xFCberf\xE4llig"}},Wr={add_task:{added:'"{title}" wurde hinzugef\xFCgt.',admin_only:"Nur Administratoren k\xF6nnen Aufgaben hinzuf\xFCgen."}},Zr={cards:{new:{title:"Neue Aufgabe erstellen",fields:{title:{heading:"Aufgabentitel"},interval_value:{heading:"Intervall"},interval_type:{heading:"Intervalltyp"},last_performed:{heading:"Zuletzt durchgef\xFChrt",helper:"Leer lassen, um heutiges Datum zu verwenden"},anchor_date:{heading:"Ankerdatum",helper:"Der Zeitplan wiederholt sich ab diesem festen Datum"},tag:{heading:"Tag"},icon:{heading:"Symbol"},label:{heading:"Bezeichnung(en)"},area:{heading:"Bereich"},trigger_type:{heading:"Ausl\xF6ser-Typ"},count_entity_id:{heading:"Gez\xE4hlte Entit\xE4t"},count_threshold:{heading:"Z\xE4hl-Schwellwert"},runtime_entity_id:{heading:"Laufzeit-Sensor"},runtime_threshold:{heading:"Laufzeit-Schwellwert"},description:{heading:"Beschreibung"},group_id:{heading:"Gruppe",helper:"Gruppe w\xE4hlen oder neuen Namen eingeben"},notifications_enabled:{heading:"Benachrichtigungen aktivieren"},notification_target:{heading:"Benachrichtigungsdienst",helper:"Leer lassen, um notify.notify zu verwenden"},notify_when:{heading:"Benachrichtigen bei"},notify_days_before_due:{heading:"Tage vor F\xE4lligkeit",helper:"Optionale Vorab-Erinnerung"},notification_time:{heading:"Uhrzeit",helper:"Wann automatische Benachrichtigungen gesendet werden"},notification_url:{heading:"URL \xF6ffnen",helper:"Optionale URL f\xFCr die Aktion \u201E\xD6ffnen\u201C der Benachrichtigung"},active_months:{heading:"Aktive Monate",helper:"Saisonale Aufgaben sind nur in diesen Monaten f\xE4llig (leer = ganzj\xE4hrig)"}},sections:{optional:"Optionale Einstellungen",notifications:"Benachrichtigungen"},actions:{add_task:"Aufgabe hinzuf\xFCgen"},alerts:{required:"Bitte alle Felder ausf\xFCllen",error:"Fehler beim Hinzuf\xFCgen der Aufgabe. Siehe Konsole f\xFCr Details."}},current:{next:"N\xE4chste F\xE4lligkeit",actions:{edit:"Bearbeiten",move:"In Gruppe verschieben",remove:"Entfernen"},alerts:{complete_success:'"{title}" wurde als erledigt markiert. Das n\xE4chste F\xE4lligkeitsdatum wurde neu berechnet.',complete_error:"Aufgabe konnte nicht als erledigt markiert werden. Details siehe Konsole.",remove_error:"Aufgabe konnte nicht entfernt werden. Details in der Konsole."},filter:{search:"Aufgaben durchsuchen...",templates:"Vorlagen durchsuchen",export:"CSV exportieren",clear:"Filter zur\xFCcksetzen"}},groups:{title:"Gruppen",fields:{new_group:{heading:"Neue Gruppe"}},actions:{create:"Erstellen",rename:"Umbenennen",delete:"L\xF6schen",save:"Speichern"},empty:"Noch keine Gruppen. Erstellen Sie eine, um Aufgaben zu organisieren.",confirm_delete:'Gruppe "{title}" l\xF6schen? Ihre Aufgaben werden in "Ohne Gruppe" verschoben.',alerts:{error:"Gruppe konnte nicht erstellt werden. Pr\xFCfen Sie die Browserkonsole und die Home-Assistant-Protokolle.",exists:'Gruppe "{title}" existiert bereits.',rename_error:"Gruppe konnte nicht umbenannt werden. Details in der Konsole.",delete_error:"Gruppe konnte nicht gel\xF6scht werden. Details in der Konsole."},confirm_delete_title:"Gruppe l\xF6schen"}},dialog:{edit_task:{title:"Aufgabe bearbeiten",fields:{interval_value:{heading:"Intervall"},interval_type:{heading:"Intervalltyp"},last_performed:{heading:"Zuletzt durchgef\xFChrt",helper:"Leer lassen, um heutiges Datum zu verwenden"},anchor_date:{heading:"Ankerdatum",helper:"Der Zeitplan wiederholt sich ab diesem festen Datum"},tag:{heading:"Tag"},icon:{heading:"Symbol"},label:{heading:"Bezeichnung(en)"},area:{heading:"Bereich"},trigger_type:{heading:"Ausl\xF6ser-Typ"},count_entity_id:{heading:"Gez\xE4hlte Entit\xE4t"},count_threshold:{heading:"Z\xE4hl-Schwellwert"},runtime_entity_id:{heading:"Laufzeit-Sensor"},runtime_threshold:{heading:"Laufzeit-Schwellwert"},title:{heading:"Titel"},description:{heading:"Beschreibung"},group_id:{heading:"Gruppe",helper:"Gruppe w\xE4hlen oder neuen Namen eingeben"},notifications_enabled:{heading:"Benachrichtigungen aktivieren"},notification_target:{heading:"Benachrichtigungsdienst",helper:"Leer lassen, um notify.notify zu verwenden"},notify_when:{heading:"Benachrichtigen bei"},notify_days_before_due:{heading:"Tage vor F\xE4lligkeit",helper:"Optionale Vorab-Erinnerung"},notification_time:{heading:"Uhrzeit",helper:"Wann automatische Benachrichtigungen gesendet werden"},notification_url:{heading:"URL \xF6ffnen",helper:"Optionale URL f\xFCr die Aktion \u201E\xD6ffnen\u201C der Benachrichtigung"},active_months:{heading:"Aktive Monate",helper:"Saisonale Aufgaben sind nur in diesen Monaten f\xE4llig (leer = ganzj\xE4hrig)"}},sections:{optional:"Optionale Einstellungen",notifications:"Benachrichtigungen",history:"Verlauf"},actions:{cancel:"Abbrechen",save:"Speichern",test_notification:"Testbenachrichtigung senden"},alerts:{error:"\xC4nderungen konnten nicht gespeichert werden. Details in der Konsole.",test_error:"Testbenachrichtigung konnte nicht gesendet werden. Details in der Konsole."}},move_task:{title:"Aufgabe verschieben",fields:{group_id:{heading:"Gruppe"}},actions:{cancel:"Abbrechen",move:"Verschieben"}},confirm_complete:{title:"Aufgabe als erledigt markieren",message:'"{title}" als erledigt markieren? Zuletzt durchgef\xFChrt wird auf heute zur\xFCckgesetzt und das n\xE4chste F\xE4lligkeitsdatum wird basierend auf dem Intervall von {interval} neu berechnet.',message_progress:'"{title}" als erledigt markieren? Der Fortschritt ({interval}) beginnt von vorn.',note_label:"Notiz (optional)",actions:{confirm:"Als erledigt markieren"}},confirm_remove:{title:"Aufgabe entfernen",message:'"{title}" entfernen? Dies kann nicht r\xFCckg\xE4ngig gemacht werden.',actions:{confirm:"Entfernen"}},templates:{title:"Aufgabenvorlagen",search:"Vorlagen durchsuchen...",import_csv:"Aus CSV importieren",choose_csv:"CSV-Datei ausw\xE4hlen",csv_hint:"Spalten: title (erforderlich), description, interval_value, interval_type, last_performed (JJJJ-MM-TT), icon, group_id",csv_empty:"Keine importierbaren Zeilen in der Datei gefunden.",no_matches:"Keine Vorlagen entsprechen deiner Suche.",import_count:"{count, plural, one {1 Aufgabe importieren} other {# Aufgaben importieren}}",imported:"{count, plural, one {1 Aufgabe importiert.} other {# Aufgaben importiert.}}",import_failed:"Import fehlgeschlagen: {titles}",preview:{title:"Titel",interval:"Intervall",last_performed:"Zuletzt erledigt",group:"Gruppe"}}},toolbar:{add_task:"Aufgabe hinzuf\xFCgen",manage_groups:"Gruppen verwalten"},nav:{all_tasks:"Alle Aufgaben",done_editing:"Fertig"},list:{due_today:"Heute f\xE4llig",days_overdue:"{count, plural, one {1 Tag \xFCberf\xE4llig} other {# Tage \xFCberf\xE4llig}}",days_left:"{count, plural, one {F\xE4llig in 1 Tag} other {Noch # Tage}}",search:"Aufgaben suchen...",all_groups:"Alle Gruppen",overdue:"\xDCberf\xE4llig",due_soon:"Bald f\xE4llig",upcoming:"Anstehend",no_tasks:"Keine Aufgaben gefunden",done:"Erledigt",last_performed:"Zuletzt durchgef\xFChrt",progress:"Fortschritt",history:"Verlauf",complete:"Abschlie\xDFen",remove:"Entfernen",all_caught_up:"Alles erledigt",needs_attention:"{count, plural, one {1 Aufgabe braucht Aufmerksamkeit} other {# Aufgaben brauchen Aufmerksamkeit}}",done_today:"Heute erledigt",repeats:"Wiederholung",next_due:"Wieder f\xE4llig am {date}",clear_search:"Suche l\xF6schen",group_by:"Gruppieren nach",by_status:"Status"},empty:{title:"Noch keine Aufgaben",message:"F\xFCge deine erste Aufgabe hinzu oder starte mit der Vorlagenbibliothek f\xFCr typische Aufgaben im Haushalt.",message_readonly:"Aufgaben, die ein Administrator hinzuf\xFCgt, erscheinen hier."}},Xr={categories:{hvac:"Heizung & Klima",plumbing:"Sanit\xE4r",electrical:"Elektrik",appliances:"Haushaltsger\xE4te",interior:"Innenbereich",exterior:"Au\xDFenbereich",yard:"Garten",safety:"Sicherheit",vehicles:"Fahrzeuge"}},Yr={common:Gr,intervals:jr,trigger_types:Vr,notifications:qr,card:Wr,panel:Zr,templates:Xr};var yt={};O(yt,{card:()=>ta,common:()=>Jr,default:()=>aa,intervals:()=>Qr,notifications:()=>ea,panel:()=>ia,templates:()=>ra,trigger_types:()=>Kr});var Jr={loading:"Cargando...",none:"Ninguno",no_tasks:"No se encontraron tareas.",ungrouped:"Sin grupo",cancel:"Cancelar",invalid_date:"La fecha introducida no es v\xE1lida."},Qr={day:"D\xEDa",days:"D\xEDas",week:"Semana",weeks:"Semanas",month:"Mes",months:"Meses",year:"A\xF1o",years:"A\xF1os",every_uses:"Cada {value} usos",every_runtime:"Cada {value} de funcionamiento"},Kr={time:"Basado en tiempo",date:"Fecha fija",count:"Basado en conteo",runtime:"Basado en tiempo de funcionamiento"},ea={when:{due:"Al vencer",overdue:"Con retraso",due_and_overdue:"Al vencer y con retraso"}},ta={add_task:{added:'Se a\xF1adi\xF3 "{title}".',admin_only:"Solo los administradores pueden a\xF1adir tareas."}},ia={cards:{new:{title:"Crear nueva tarea",fields:{title:{heading:"T\xEDtulo de la tarea"},interval_value:{heading:"Intervalo"},interval_type:{heading:"Tipo de intervalo"},last_performed:{heading:"\xDAltima realizaci\xF3n",helper:"Deja en blanco para usar hoy"},anchor_date:{heading:"Fecha de anclaje",helper:"La programaci\xF3n se repite a partir de esta fecha fija"},tag:{heading:"Tag"},icon:{heading:"Icono"},label:{heading:"Etiqueta(s)"},area:{heading:"\xC1rea"},description:{heading:"Descripci\xF3n"},trigger_type:{heading:"Tipo de disparador"},count_entity_id:{heading:"Entidad contada"},count_threshold:{heading:"Umbral de conteo"},runtime_entity_id:{heading:"Sensor de tiempo de funcionamiento"},runtime_threshold:{heading:"Umbral de tiempo de funcionamiento"},group_id:{heading:"Grupo",helper:"Elige un grupo o escribe un nombre nuevo"},notifications_enabled:{heading:"Activar notificaciones"},notification_target:{heading:"Servicio de notificaci\xF3n",helper:"Deja vac\xEDo para usar notify.notify"},notify_when:{heading:"Notificar cuando"},notify_days_before_due:{heading:"D\xEDas antes del vencimiento",helper:"Desfase opcional del recordatorio de vencimiento pr\xF3ximo"},notification_time:{heading:"Hora del d\xEDa",helper:"Cu\xE1ndo se env\xEDan las notificaciones autom\xE1ticas"},notification_url:{heading:"URL para abrir",helper:"URL opcional para la acci\xF3n Abrir de la notificaci\xF3n"},active_months:{heading:"Meses activos",helper:"Las tareas de temporada solo vencen en estos meses (vac\xEDo = todo el a\xF1o)"}},sections:{optional:"Ajustes opcionales",notifications:"Notificaciones"},actions:{add_task:"A\xF1adir tarea"},alerts:{required:"Completa todos los campos",error:"Error al a\xF1adir la tarea. Consulta la consola para m\xE1s detalles."}},current:{next:"Pr\xF3ximo vencimiento",actions:{edit:"Editar",move:"Mover a un grupo",remove:"Eliminar"},alerts:{complete_success:'"{title}" marcada como completada. Se recalcul\xF3 la pr\xF3xima fecha de vencimiento.',complete_error:"No se pudo marcar la tarea como completada. Consulta la consola para m\xE1s detalles.",remove_error:"No se pudo eliminar la tarea. Consulta la consola para m\xE1s detalles."},filter:{search:"Buscar tareas...",templates:"Explorar plantillas",export:"Exportar CSV",clear:"Borrar filtros"}},groups:{title:"Grupos",fields:{new_group:{heading:"Nuevo grupo"}},actions:{create:"Crear",rename:"Renombrar",delete:"Eliminar",save:"Guardar"},empty:"A\xFAn no hay grupos. Crea uno para organizar tus tareas.",confirm_delete:'\xBFEliminar el grupo "{title}"? Sus tareas se mover\xE1n a Sin grupo.',alerts:{error:"No se pudo crear el grupo. Revisa la consola del navegador y los registros de Home Assistant.",exists:'El grupo "{title}" ya existe.',rename_error:"No se pudo renombrar el grupo. Consulta la consola para m\xE1s detalles.",delete_error:"No se pudo eliminar el grupo. Consulta la consola para m\xE1s detalles."},confirm_delete_title:"Eliminar grupo"}},dialog:{edit_task:{title:"Editar tarea",fields:{interval_value:{heading:"Intervalo"},interval_type:{heading:"Tipo de intervalo"},last_performed:{heading:"\xDAltima realizaci\xF3n",helper:"Deja en blanco para usar hoy"},anchor_date:{heading:"Fecha de anclaje",helper:"La programaci\xF3n se repite a partir de esta fecha fija"},tag:{heading:"Tag"},icon:{heading:"Icono"},label:{heading:"Etiqueta(s)"},area:{heading:"\xC1rea"},trigger_type:{heading:"Tipo de disparador"},count_entity_id:{heading:"Entidad contada"},count_threshold:{heading:"Umbral de conteo"},runtime_entity_id:{heading:"Sensor de tiempo de funcionamiento"},runtime_threshold:{heading:"Umbral de tiempo de funcionamiento"},title:{heading:"T\xEDtulo"},description:{heading:"Descripci\xF3n"},group_id:{heading:"Grupo",helper:"Elige un grupo o escribe un nombre nuevo"},notifications_enabled:{heading:"Activar notificaciones"},notification_target:{heading:"Servicio de notificaci\xF3n",helper:"Deja vac\xEDo para usar notify.notify"},notify_when:{heading:"Notificar cuando"},notify_days_before_due:{heading:"D\xEDas antes del vencimiento",helper:"Desfase opcional del recordatorio de vencimiento pr\xF3ximo"},notification_time:{heading:"Hora del d\xEDa",helper:"Cu\xE1ndo se env\xEDan las notificaciones autom\xE1ticas"},notification_url:{heading:"URL para abrir",helper:"URL opcional para la acci\xF3n Abrir de la notificaci\xF3n"},active_months:{heading:"Meses activos",helper:"Las tareas de temporada solo vencen en estos meses (vac\xEDo = todo el a\xF1o)"}},sections:{optional:"Ajustes opcionales",notifications:"Notificaciones",history:"Historial"},actions:{cancel:"Cancelar",save:"Guardar",test_notification:"Enviar notificaci\xF3n de prueba"},alerts:{error:"No se pudieron guardar los cambios. Consulta la consola para m\xE1s detalles.",test_error:"No se pudo enviar la notificaci\xF3n de prueba. Consulta la consola para m\xE1s detalles."}},move_task:{title:"Mover tarea",fields:{group_id:{heading:"Grupo"}},actions:{cancel:"Cancelar",move:"Mover"}},confirm_complete:{title:"Marcar tarea como completada",message:'\xBFMarcar "{title}" como completada? La \xFAltima realizaci\xF3n se restablecer\xE1 a hoy y la pr\xF3xima fecha de vencimiento se recalcular\xE1 seg\xFAn el intervalo de {interval}.',message_progress:'\xBFMarcar "{title}" como completada? El progreso ({interval}) comenzar\xE1 de nuevo.',note_label:"Nota (opcional)",actions:{confirm:"Marcar como completada"}},confirm_remove:{title:"Eliminar tarea",message:'\xBFEliminar "{title}"? Esta acci\xF3n no se puede deshacer.',actions:{confirm:"Eliminar"}},templates:{title:"Plantillas de tareas",search:"Buscar plantillas...",import_csv:"Importar desde CSV",choose_csv:"Elegir archivo CSV",csv_hint:"Columnas: title (obligatoria), description, interval_value, interval_type, last_performed (AAAA-MM-DD), icon, group_id",csv_empty:"No se encontraron filas importables en el archivo.",no_matches:"Ninguna plantilla coincide con tu b\xFAsqueda.",import_count:"{count, plural, one {Importar 1 tarea} other {Importar # tareas}}",imported:"{count, plural, one {1 tarea importada.} other {# tareas importadas.}}",import_failed:"Error al importar: {titles}",preview:{title:"T\xEDtulo",interval:"Intervalo",last_performed:"\xDAltima realizaci\xF3n",group:"Grupo"}}},toolbar:{add_task:"A\xF1adir tarea",manage_groups:"Gestionar grupos"},nav:{all_tasks:"Todas las tareas",done_editing:"Listo"},list:{due_today:"Vence hoy",days_overdue:"{count, plural, one {1 d\xEDa de retraso} other {# d\xEDas de retraso}}",days_left:"{count, plural, one {Vence en 1 d\xEDa} other {Quedan # d\xEDas}}",search:"Buscar tareas...",all_groups:"Todos los grupos",overdue:"Atrasadas",due_soon:"Vencen pronto",upcoming:"Pr\xF3ximas",no_tasks:"No se encontraron tareas",done:"Hecho",last_performed:"\xDAltima realizaci\xF3n",progress:"Progreso",history:"Historial",complete:"Completar",remove:"Eliminar",all_caught_up:"Todo al d\xEDa",needs_attention:"{count, plural, one {1 tarea requiere atenci\xF3n} other {# tareas requieren atenci\xF3n}}",done_today:"Hecho hoy",repeats:"Se repite",next_due:"Pr\xF3ximo vencimiento: {date}",clear_search:"Borrar b\xFAsqueda",group_by:"Agrupar por",by_status:"Estado"},empty:{title:"A\xFAn no hay tareas",message:"A\xF1ade tu primera tarea o empieza con la biblioteca de plantillas de tareas dom\xE9sticas habituales.",message_readonly:"Las tareas que a\xF1ada un administrador aparecer\xE1n aqu\xED."}},ra={categories:{hvac:"Climatizaci\xF3n",plumbing:"Fontaner\xEDa",electrical:"Electricidad",appliances:"Electrodom\xE9sticos",interior:"Interior",exterior:"Exterior",yard:"Jard\xEDn",safety:"Seguridad",vehicles:"Veh\xEDculos"}},aa={common:Jr,intervals:Qr,trigger_types:Kr,notifications:ea,card:ta,panel:ia,templates:ra};var vt={};O(vt,{card:()=>ca,common:()=>na,default:()=>ha,intervals:()=>oa,notifications:()=>la,panel:()=>da,templates:()=>ua,trigger_types:()=>sa});var na={loading:"Chargement...",none:"Aucun",no_tasks:"Aucune t\xE2che trouv\xE9e.",ungrouped:"Sans groupe",cancel:"Annuler",invalid_date:"Date saisie non valide."},oa={day:"Jour",days:"Jours",week:"Semaine",weeks:"Semaines",month:"Mois",months:"Mois",year:"Ann\xE9e",years:"Ann\xE9es",every_uses:"Toutes les {value} utilisations",every_runtime:"Tous les {value} de fonctionnement"},sa={time:"Bas\xE9 sur le temps",date:"Date fixe",count:"Bas\xE9 sur un compteur",runtime:"Bas\xE9 sur le fonctionnement"},la={when:{due:"\xC0 \xE9ch\xE9ance",overdue:"En retard",due_and_overdue:"\xC0 \xE9ch\xE9ance et en retard"}},ca={add_task:{added:'"{title}" ajout\xE9e.',admin_only:"Seuls les administrateurs peuvent ajouter des t\xE2ches."}},da={cards:{new:{title:"Cr\xE9er une nouvelle t\xE2che",fields:{title:{heading:"Titre de la t\xE2che"},interval_value:{heading:"Intervalle"},interval_type:{heading:"Type d'intervalle"},last_performed:{heading:"Derni\xE8re ex\xE9cution",helper:"Laissez vide pour utiliser aujourd'hui"},anchor_date:{heading:"Date d'ancrage",helper:"Le planning se r\xE9p\xE8te \xE0 partir de cette date fixe"},tag:{heading:"Tag"},icon:{heading:"Ic\xF4ne"},label:{heading:"Libell\xE9(s)"},area:{heading:"Pi\xE8ce"},description:{heading:"Description"},trigger_type:{heading:"Type de d\xE9clencheur"},count_entity_id:{heading:"Entit\xE9 compt\xE9e"},count_threshold:{heading:"Seuil de comptage"},runtime_entity_id:{heading:"Capteur de fonctionnement"},runtime_threshold:{heading:"Seuil de fonctionnement"},group_id:{heading:"Groupe",helper:"Choisissez un groupe ou saisissez un nouveau nom"},notifications_enabled:{heading:"Activer les notifications"},notification_target:{heading:"Service de notification",helper:"Laissez vide pour utiliser notify.notify"},notify_when:{heading:"Notifier quand"},notify_days_before_due:{heading:"Jours avant l'\xE9ch\xE9ance",helper:"D\xE9calage facultatif du rappel d'\xE9ch\xE9ance proche"},notification_time:{heading:"Heure de la journ\xE9e",helper:"Heure d'envoi des notifications automatiques"},notification_url:{heading:"URL \xE0 ouvrir",helper:"URL facultative pour l'action Ouvrir de la notification"},active_months:{heading:"Mois actifs",helper:"Les t\xE2ches saisonni\xE8res ne sont dues que pendant ces mois (vide = toute l'ann\xE9e)"}},sections:{optional:"Param\xE8tres facultatifs",notifications:"Notifications"},actions:{add_task:"Ajouter la t\xE2che"},alerts:{required:"Veuillez remplir tous les champs",error:"Erreur lors de l'ajout de la t\xE2che. Consultez la console pour plus de d\xE9tails."}},current:{next:"Prochaine \xE9ch\xE9ance",actions:{edit:"Modifier",move:"D\xE9placer vers un groupe",remove:"Supprimer"},alerts:{complete_success:'"{title}" marqu\xE9e comme termin\xE9e. La prochaine \xE9ch\xE9ance a \xE9t\xE9 recalcul\xE9e.',complete_error:"Impossible de marquer la t\xE2che comme termin\xE9e. Consultez la console pour plus de d\xE9tails.",remove_error:"Impossible de supprimer la t\xE2che. Consultez la console pour plus de d\xE9tails."},filter:{search:"Rechercher des t\xE2ches...",templates:"Parcourir les mod\xE8les",export:"Exporter en CSV",clear:"Effacer les filtres"}},groups:{title:"Groupes",fields:{new_group:{heading:"Nouveau groupe"}},actions:{create:"Cr\xE9er",rename:"Renommer",delete:"Supprimer",save:"Enregistrer"},empty:"Aucun groupe pour le moment. Cr\xE9ez-en un pour organiser vos t\xE2ches.",confirm_delete:'Supprimer le groupe "{title}" ? Ses t\xE2ches seront d\xE9plac\xE9es vers Sans groupe.',alerts:{error:"Impossible de cr\xE9er le groupe. V\xE9rifiez la console du navigateur et les journaux de Home Assistant.",exists:'Le groupe "{title}" existe d\xE9j\xE0.',rename_error:"Impossible de renommer le groupe. Consultez la console pour plus de d\xE9tails.",delete_error:"Impossible de supprimer le groupe. Consultez la console pour plus de d\xE9tails."},confirm_delete_title:"Supprimer le groupe"}},dialog:{edit_task:{title:"Modifier la t\xE2che",fields:{interval_value:{heading:"Intervalle"},interval_type:{heading:"Type d'intervalle"},last_performed:{heading:"Derni\xE8re ex\xE9cution",helper:"Laissez vide pour utiliser aujourd'hui"},anchor_date:{heading:"Date d'ancrage",helper:"Le planning se r\xE9p\xE8te \xE0 partir de cette date fixe"},tag:{heading:"Tag"},icon:{heading:"Ic\xF4ne"},label:{heading:"Libell\xE9(s)"},area:{heading:"Pi\xE8ce"},trigger_type:{heading:"Type de d\xE9clencheur"},count_entity_id:{heading:"Entit\xE9 compt\xE9e"},count_threshold:{heading:"Seuil de comptage"},runtime_entity_id:{heading:"Capteur de fonctionnement"},runtime_threshold:{heading:"Seuil de fonctionnement"},title:{heading:"Titre"},description:{heading:"Description"},group_id:{heading:"Groupe",helper:"Choisissez un groupe ou saisissez un nouveau nom"},notifications_enabled:{heading:"Activer les notifications"},notification_target:{heading:"Service de notification",helper:"Laissez vide pour utiliser notify.notify"},notify_when:{heading:"Notifier quand"},notify_days_before_due:{heading:"Jours avant l'\xE9ch\xE9ance",helper:"D\xE9calage facultatif du rappel d'\xE9ch\xE9ance proche"},notification_time:{heading:"Heure de la journ\xE9e",helper:"Heure d'envoi des notifications automatiques"},notification_url:{heading:"URL \xE0 ouvrir",helper:"URL facultative pour l'action Ouvrir de la notification"},active_months:{heading:"Mois actifs",helper:"Les t\xE2ches saisonni\xE8res ne sont dues que pendant ces mois (vide = toute l'ann\xE9e)"}},sections:{optional:"Param\xE8tres facultatifs",notifications:"Notifications",history:"Historique"},actions:{cancel:"Annuler",save:"Enregistrer",test_notification:"Envoyer une notification de test"},alerts:{error:"Impossible d'enregistrer les modifications. Consultez la console pour plus de d\xE9tails.",test_error:"Impossible d'envoyer la notification de test. Consultez la console pour plus de d\xE9tails."}},move_task:{title:"D\xE9placer la t\xE2che",fields:{group_id:{heading:"Groupe"}},actions:{cancel:"Annuler",move:"D\xE9placer"}},confirm_complete:{title:"Marquer la t\xE2che comme termin\xE9e",message:`Marquer "{title}" comme termin\xE9e ? La derni\xE8re ex\xE9cution sera r\xE9initialis\xE9e \xE0 aujourd'hui et la prochaine \xE9ch\xE9ance sera recalcul\xE9e en fonction de l'intervalle {interval}.`,message_progress:'Marquer "{title}" comme termin\xE9e ? La progression ({interval}) repartira de z\xE9ro.',note_label:"Note (facultatif)",actions:{confirm:"Marquer comme termin\xE9e"}},confirm_remove:{title:"Supprimer la t\xE2che",message:'Supprimer "{title}" ? Cette action est irr\xE9versible.',actions:{confirm:"Supprimer"}},templates:{title:"Mod\xE8les de t\xE2ches",search:"Rechercher des mod\xE8les...",import_csv:"Importer depuis un CSV",choose_csv:"Choisir un fichier CSV",csv_hint:"Colonnes : title (obligatoire), description, interval_value, interval_type, last_performed (AAAA-MM-JJ), icon, group_id",csv_empty:"Aucune ligne importable trouv\xE9e dans le fichier.",no_matches:"Aucun mod\xE8le ne correspond \xE0 votre recherche.",import_count:"{count, plural, one {Importer 1 t\xE2che} other {Importer # t\xE2ches}}",imported:"{count, plural, one {1 t\xE2che import\xE9e.} other {# t\xE2ches import\xE9es.}}",import_failed:"\xC9chec de l'importation : {titles}",preview:{title:"Titre",interval:"Intervalle",last_performed:"Derni\xE8re ex\xE9cution",group:"Groupe"}}},toolbar:{add_task:"Ajouter une t\xE2che",manage_groups:"G\xE9rer les groupes"},nav:{all_tasks:"Toutes les t\xE2ches",done_editing:"Termin\xE9"},list:{due_today:"\xC9ch\xE9ance aujourd'hui",days_overdue:"{count, plural, one {1 jour de retard} other {# jours de retard}}",days_left:"{count, plural, one {\xC9ch\xE9ance dans 1 jour} other {# jours restants}}",search:"Rechercher des t\xE2ches...",all_groups:"Tous les groupes",overdue:"En retard",due_soon:"\xC9ch\xE9ance proche",upcoming:"\xC0 venir",no_tasks:"Aucune t\xE2che trouv\xE9e",done:"Termin\xE9",last_performed:"Derni\xE8re ex\xE9cution",progress:"Progression",history:"Historique",complete:"Terminer",remove:"Supprimer",all_caught_up:"Tout est \xE0 jour",needs_attention:"{count, plural, one {1 t\xE2che requiert votre attention} other {# t\xE2ches requi\xE8rent votre attention}}",done_today:"Fait aujourd'hui",repeats:"R\xE9p\xE9tition",next_due:"Prochaine \xE9ch\xE9ance : {date}",clear_search:"Effacer la recherche",group_by:"Regrouper par",by_status:"Statut"},empty:{title:"Aucune t\xE2che pour l'instant",message:"Ajoutez votre premi\xE8re t\xE2che ou partez de la biblioth\xE8que de mod\xE8les de t\xE2ches m\xE9nag\xE8res courantes.",message_readonly:"Les t\xE2ches ajout\xE9es par un administrateur appara\xEEtront ici."}},ua={categories:{hvac:"CVC",plumbing:"Plomberie",electrical:"\xC9lectricit\xE9",appliances:"\xC9lectrom\xE9nager",interior:"Int\xE9rieur",exterior:"Ext\xE9rieur",yard:"Jardin",safety:"S\xE9curit\xE9",vehicles:"V\xE9hicules"}},ha={common:na,intervals:oa,trigger_types:sa,notifications:la,card:ca,panel:da,templates:ua};var bt={};O(bt,{card:()=>_a,common:()=>pa,default:()=>ba,intervals:()=>ma,notifications:()=>fa,panel:()=>ya,templates:()=>va,trigger_types:()=>ga});var pa={loading:"Caricamento...",none:"Nessuno",no_tasks:"Nessuna attivit\xE0 trovata.",ungrouped:"Senza gruppo",cancel:"Annulla",invalid_date:"Data inserita non valida."},ma={day:"Giorno",days:"Giorni",week:"Settimana",weeks:"Settimane",month:"Mese",months:"Mesi",year:"Anno",years:"Anni",every_uses:"Ogni {value} utilizzi",every_runtime:"Ogni {value} di funzionamento"},ga={time:"Basato sul tempo",date:"Data fissa",count:"Basato sul conteggio",runtime:"Basato sul tempo di funzionamento"},fa={when:{due:"In scadenza",overdue:"Scadute",due_and_overdue:"In scadenza e scadute"}},_a={add_task:{added:'"{title}" aggiunta.',admin_only:"Solo gli amministratori possono aggiungere attivit\xE0."}},ya={cards:{new:{title:"Crea nuova attivit\xE0",fields:{title:{heading:"Titolo attivit\xE0"},interval_value:{heading:"Intervallo"},interval_type:{heading:"Tipo di intervallo"},last_performed:{heading:"Ultima esecuzione",helper:"Lascia vuoto per usare oggi"},anchor_date:{heading:"Data di riferimento",helper:"La pianificazione si ripete a partire da questa data fissa"},tag:{heading:"Tag"},icon:{heading:"Icona"},label:{heading:"Etichetta/e"},area:{heading:"Area"},description:{heading:"Descrizione"},trigger_type:{heading:"Tipo di attivazione"},count_entity_id:{heading:"Entit\xE0 conteggiata"},count_threshold:{heading:"Soglia di conteggio"},runtime_entity_id:{heading:"Sensore tempo di funzionamento"},runtime_threshold:{heading:"Soglia tempo di funzionamento"},group_id:{heading:"Gruppo",helper:"Scegli un gruppo o digita un nuovo nome"},notifications_enabled:{heading:"Abilita notifiche"},notification_target:{heading:"Servizio di notifica",helper:"Lascia vuoto per usare notify.notify"},notify_when:{heading:"Notifica quando"},notify_days_before_due:{heading:"Giorni prima della scadenza",helper:"Anticipo facoltativo per il promemoria di scadenza imminente"},notification_time:{heading:"Ora del giorno",helper:"Quando vengono inviate le notifiche automatiche"},notification_url:{heading:"URL da aprire",helper:"URL facoltativo per l'azione Apri della notifica"},active_months:{heading:"Mesi attivi",helper:"Le attivit\xE0 stagionali scadono solo in questi mesi (vuoto = tutto l'anno)"}},sections:{optional:"Impostazioni facoltative",notifications:"Notifiche"},actions:{add_task:"Aggiungi attivit\xE0"},alerts:{required:"Compila tutti i campi",error:"Errore durante l'aggiunta dell'attivit\xE0. Vedi la console per i dettagli."}},current:{next:"Prossima scadenza",actions:{edit:"Modifica",move:"Sposta nel gruppo",remove:"Rimuovi"},alerts:{complete_success:'"{title}" contrassegnata come completata. La prossima scadenza \xE8 stata ricalcolata.',complete_error:"Impossibile contrassegnare l'attivit\xE0 come completata. Vedi la console per i dettagli.",remove_error:"Impossibile rimuovere l'attivit\xE0. Vedi la console per i dettagli."},filter:{search:"Cerca attivit\xE0...",templates:"Sfoglia modelli",export:"Esporta CSV",clear:"Cancella filtri"}},groups:{title:"Gruppi",fields:{new_group:{heading:"Nuovo gruppo"}},actions:{create:"Crea",rename:"Rinomina",delete:"Elimina",save:"Salva"},empty:"Nessun gruppo ancora. Creane uno per organizzare le tue attivit\xE0.",confirm_delete:'Eliminare il gruppo "{title}"? Le sue attivit\xE0 passeranno a Senza gruppo.',alerts:{error:"Impossibile creare il gruppo. Controlla la console del browser e i log di Home Assistant.",exists:'Il gruppo "{title}" esiste gi\xE0.',rename_error:"Impossibile rinominare il gruppo. Vedi la console per i dettagli.",delete_error:"Impossibile eliminare il gruppo. Vedi la console per i dettagli."},confirm_delete_title:"Elimina gruppo"}},dialog:{edit_task:{title:"Modifica attivit\xE0",fields:{interval_value:{heading:"Intervallo"},interval_type:{heading:"Tipo di intervallo"},last_performed:{heading:"Ultima esecuzione",helper:"Lascia vuoto per usare oggi"},anchor_date:{heading:"Data di riferimento",helper:"La pianificazione si ripete a partire da questa data fissa"},tag:{heading:"Tag"},icon:{heading:"Icona"},label:{heading:"Etichetta/e"},area:{heading:"Area"},trigger_type:{heading:"Tipo di attivazione"},count_entity_id:{heading:"Entit\xE0 conteggiata"},count_threshold:{heading:"Soglia di conteggio"},runtime_entity_id:{heading:"Sensore tempo di funzionamento"},runtime_threshold:{heading:"Soglia tempo di funzionamento"},title:{heading:"Titolo"},description:{heading:"Descrizione"},group_id:{heading:"Gruppo",helper:"Scegli un gruppo o digita un nuovo nome"},notifications_enabled:{heading:"Abilita notifiche"},notification_target:{heading:"Servizio di notifica",helper:"Lascia vuoto per usare notify.notify"},notify_when:{heading:"Notifica quando"},notify_days_before_due:{heading:"Giorni prima della scadenza",helper:"Anticipo facoltativo per il promemoria di scadenza imminente"},notification_time:{heading:"Ora del giorno",helper:"Quando vengono inviate le notifiche automatiche"},notification_url:{heading:"URL da aprire",helper:"URL facoltativo per l'azione Apri della notifica"},active_months:{heading:"Mesi attivi",helper:"Le attivit\xE0 stagionali scadono solo in questi mesi (vuoto = tutto l'anno)"}},sections:{optional:"Impostazioni facoltative",notifications:"Notifiche",history:"Cronologia"},actions:{cancel:"Annulla",save:"Salva",test_notification:"Invia notifica di prova"},alerts:{error:"Impossibile salvare le modifiche. Vedi la console per i dettagli.",test_error:"Impossibile inviare la notifica di prova. Vedi la console per i dettagli."}},move_task:{title:"Sposta attivit\xE0",fields:{group_id:{heading:"Gruppo"}},actions:{cancel:"Annulla",move:"Sposta"}},confirm_complete:{title:"Contrassegna attivit\xE0 come completata",message:`Contrassegnare "{title}" come completata? L'ultima esecuzione sar\xE0 reimpostata a oggi e la prossima scadenza sar\xE0 ricalcolata in base all'intervallo {interval}.`,message_progress:`Contrassegnare "{title}" come completata? L'avanzamento ({interval}) ripartir\xE0 da zero.`,note_label:"Nota (facoltativa)",actions:{confirm:"Contrassegna come completata"}},confirm_remove:{title:"Rimuovi attivit\xE0",message:`Rimuovere "{title}"? L'operazione non pu\xF2 essere annullata.`,actions:{confirm:"Rimuovi"}},templates:{title:"Modelli di attivit\xE0",search:"Cerca modelli...",import_csv:"Importa da CSV",choose_csv:"Scegli file CSV",csv_hint:"Colonne: title (obbligatoria), description, interval_value, interval_type, last_performed (AAAA-MM-GG), icon, group_id",csv_empty:"Nessuna riga importabile trovata nel file.",no_matches:"Nessun modello corrisponde alla ricerca.",import_count:"{count, plural, one {Importa 1 attivit\xE0} other {Importa # attivit\xE0}}",imported:"{count, plural, one {1 attivit\xE0 importata.} other {# attivit\xE0 importate.}}",import_failed:"Importazione non riuscita: {titles}",preview:{title:"Titolo",interval:"Intervallo",last_performed:"Ultima esecuzione",group:"Gruppo"}}},toolbar:{add_task:"Aggiungi attivit\xE0",manage_groups:"Gestisci gruppi"},nav:{all_tasks:"Tutte le attivit\xE0",done_editing:"Fine"},list:{due_today:"Scade oggi",days_overdue:"{count, plural, one {1 giorno di ritardo} other {# giorni di ritardo}}",days_left:"{count, plural, one {Scade tra 1 giorno} other {# giorni rimanenti}}",search:"Cerca attivit\xE0...",all_groups:"Tutti i gruppi",overdue:"Scadute",due_soon:"In scadenza",upcoming:"In arrivo",no_tasks:"Nessuna attivit\xE0 trovata",done:"Completate",last_performed:"Ultima esecuzione",progress:"Avanzamento",history:"Cronologia",complete:"Completa",remove:"Rimuovi",all_caught_up:"Tutto in ordine",needs_attention:"{count, plural, one {1 attivit\xE0 richiede attenzione} other {# attivit\xE0 richiedono attenzione}}",done_today:"Fatte oggi",repeats:"Ripetizione",next_due:"Prossima scadenza: {date}",clear_search:"Cancella ricerca",group_by:"Raggruppa per",by_status:"Stato"},empty:{title:"Ancora nessuna attivit\xE0",message:"Aggiungi la tua prima attivit\xE0 o parti dalla libreria di modelli con le attivit\xE0 domestiche pi\xF9 comuni.",message_readonly:"Le attivit\xE0 aggiunte da un amministratore compariranno qui."}},va={categories:{hvac:"Climatizzazione",plumbing:"Idraulica",electrical:"Impianto elettrico",appliances:"Elettrodomestici",interior:"Interni",exterior:"Esterni",yard:"Giardino",safety:"Sicurezza",vehicles:"Veicoli"}},ba={common:pa,intervals:ma,trigger_types:ga,notifications:fa,card:_a,panel:ya,templates:va};var wt={};O(wt,{card:()=>Ea,common:()=>wa,default:()=>Aa,intervals:()=>xa,notifications:()=>Ta,panel:()=>$a,templates:()=>Sa,trigger_types:()=>ka});var wa={loading:"Laden...",none:"Geen",no_tasks:"Geen taken gevonden.",ungrouped:"Niet gegroepeerd",cancel:"Annuleren",invalid_date:"Ongeldige datum ingevoerd."},xa={day:"Dag",days:"Dagen",week:"Week",weeks:"Weken",month:"Maand",months:"Maanden",year:"Jaar",years:"Jaren",every_uses:"Om de {value} gebruiksbeurten",every_runtime:"Om de {value} draaitijd"},ka={time:"Op basis van tijd",date:"Vaste datum",count:"Op basis van aantal",runtime:"Op basis van draaitijd"},Ta={when:{due:"Op vervaldatum",overdue:"Achterstallig",due_and_overdue:"Op vervaldatum en achterstallig"}},Ea={add_task:{added:'"{title}" toegevoegd.',admin_only:"Alleen beheerders kunnen taken toevoegen."}},$a={cards:{new:{title:"Nieuwe taak aanmaken",fields:{title:{heading:"Taaktitel"},interval_value:{heading:"Interval"},interval_type:{heading:"Intervaltype"},last_performed:{heading:"Laatst uitgevoerd",helper:"Laat leeg om vandaag te gebruiken"},anchor_date:{heading:"Ankerdatum",helper:"Het schema herhaalt zich vanaf deze vaste datum"},tag:{heading:"Tag"},icon:{heading:"Pictogram"},label:{heading:"Label(s)"},area:{heading:"Ruimte"},description:{heading:"Beschrijving"},trigger_type:{heading:"Triggertype"},count_entity_id:{heading:"Getelde entiteit"},count_threshold:{heading:"Teldrempel"},runtime_entity_id:{heading:"Draaitijdsensor"},runtime_threshold:{heading:"Draaitijddrempel"},group_id:{heading:"Groep",helper:"Kies een groep of typ een nieuwe naam"},notifications_enabled:{heading:"Meldingen inschakelen"},notification_target:{heading:"Meldingsservice",helper:"Laat leeg om notify.notify te gebruiken"},notify_when:{heading:"Melden wanneer"},notify_days_before_due:{heading:"Dagen v\xF3\xF3r vervaldatum",helper:"Optionele vooruitlooptijd voor de herinnering"},notification_time:{heading:"Tijdstip",helper:"Wanneer automatische meldingen worden verzonden"},notification_url:{heading:"URL openen",helper:"Optionele URL voor de Open-actie van de melding"},active_months:{heading:"Actieve maanden",helper:"Seizoenstaken zijn alleen in deze maanden verschuldigd (leeg = het hele jaar)"}},sections:{optional:"Optionele instellingen",notifications:"Meldingen"},actions:{add_task:"Taak toevoegen"},alerts:{required:"Vul alle velden in",error:"Fout bij het toevoegen van de taak. Zie de console voor details."}},current:{next:"Volgende vervaldatum",actions:{edit:"Bewerken",move:"Verplaatsen naar groep",remove:"Verwijderen"},alerts:{complete_success:'"{title}" gemarkeerd als voltooid. De volgende vervaldatum is opnieuw berekend.',complete_error:"Kan de taak niet als voltooid markeren. Zie de console voor details.",remove_error:"Kan de taak niet verwijderen. Zie de console voor details."},filter:{search:"Taken zoeken...",templates:"Sjablonen bekijken",export:"CSV exporteren",clear:"Filters wissen"}},groups:{title:"Groepen",fields:{new_group:{heading:"Nieuwe groep"}},actions:{create:"Aanmaken",rename:"Hernoemen",delete:"Verwijderen",save:"Opslaan"},empty:"Nog geen groepen. Maak er een aan om je taken te organiseren.",confirm_delete:'Groep "{title}" verwijderen? De taken worden verplaatst naar Niet gegroepeerd.',alerts:{error:"Kan de groep niet aanmaken. Controleer de browserconsole en de Home Assistant-logboeken.",exists:'Groep "{title}" bestaat al.',rename_error:"Kan de groep niet hernoemen. Zie de console voor details.",delete_error:"Kan de groep niet verwijderen. Zie de console voor details."},confirm_delete_title:"Groep verwijderen"}},dialog:{edit_task:{title:"Taak bewerken",fields:{interval_value:{heading:"Interval"},interval_type:{heading:"Intervaltype"},last_performed:{heading:"Laatst uitgevoerd",helper:"Laat leeg om vandaag te gebruiken"},anchor_date:{heading:"Ankerdatum",helper:"Het schema herhaalt zich vanaf deze vaste datum"},tag:{heading:"Tag"},icon:{heading:"Pictogram"},label:{heading:"Label(s)"},area:{heading:"Ruimte"},trigger_type:{heading:"Triggertype"},count_entity_id:{heading:"Getelde entiteit"},count_threshold:{heading:"Teldrempel"},runtime_entity_id:{heading:"Draaitijdsensor"},runtime_threshold:{heading:"Draaitijddrempel"},title:{heading:"Titel"},description:{heading:"Beschrijving"},group_id:{heading:"Groep",helper:"Kies een groep of typ een nieuwe naam"},notifications_enabled:{heading:"Meldingen inschakelen"},notification_target:{heading:"Meldingsservice",helper:"Laat leeg om notify.notify te gebruiken"},notify_when:{heading:"Melden wanneer"},notify_days_before_due:{heading:"Dagen v\xF3\xF3r vervaldatum",helper:"Optionele vooruitlooptijd voor de herinnering"},notification_time:{heading:"Tijdstip",helper:"Wanneer automatische meldingen worden verzonden"},notification_url:{heading:"URL openen",helper:"Optionele URL voor de Open-actie van de melding"},active_months:{heading:"Actieve maanden",helper:"Seizoenstaken zijn alleen in deze maanden verschuldigd (leeg = het hele jaar)"}},sections:{optional:"Optionele instellingen",notifications:"Meldingen",history:"Geschiedenis"},actions:{cancel:"Annuleren",save:"Opslaan",test_notification:"Testmelding verzenden"},alerts:{error:"Kan de wijzigingen niet opslaan. Zie de console voor details.",test_error:"Kan de testmelding niet verzenden. Zie de console voor details."}},move_task:{title:"Taak verplaatsen",fields:{group_id:{heading:"Groep"}},actions:{cancel:"Annuleren",move:"Verplaatsen"}},confirm_complete:{title:"Taak als voltooid markeren",message:'"{title}" als voltooid markeren? Laatst uitgevoerd wordt teruggezet naar vandaag en de volgende vervaldatum wordt opnieuw berekend op basis van het interval {interval}.',message_progress:'"{title}" als voltooid markeren? De voortgang ({interval}) begint opnieuw.',note_label:"Notitie (optioneel)",actions:{confirm:"Als voltooid markeren"}},confirm_remove:{title:"Taak verwijderen",message:'"{title}" verwijderen? Dit kan niet ongedaan worden gemaakt.',actions:{confirm:"Verwijderen"}},templates:{title:"Taaksjablonen",search:"Sjablonen zoeken...",import_csv:"Importeren uit CSV",choose_csv:"CSV-bestand kiezen",csv_hint:"Kolommen: title (verplicht), description, interval_value, interval_type, last_performed (JJJJ-MM-DD), icon, group_id",csv_empty:"Geen importeerbare rijen gevonden in het bestand.",no_matches:"Geen sjablonen gevonden voor je zoekopdracht.",import_count:"{count, plural, one {1 taak importeren} other {# taken importeren}}",imported:"{count, plural, one {1 taak ge\xEFmporteerd.} other {# taken ge\xEFmporteerd.}}",import_failed:"Importeren mislukt: {titles}",preview:{title:"Titel",interval:"Interval",last_performed:"Laatst uitgevoerd",group:"Groep"}}},toolbar:{add_task:"Taak toevoegen",manage_groups:"Groepen beheren"},nav:{all_tasks:"Alle taken",done_editing:"Klaar"},list:{due_today:"Vervalt vandaag",days_overdue:"{count, plural, one {1 dag achterstallig} other {# dagen achterstallig}}",days_left:"{count, plural, one {Vervalt over 1 dag} other {Nog # dagen}}",search:"Taken zoeken...",all_groups:"Alle groepen",overdue:"Achterstallig",due_soon:"Vervalt binnenkort",upcoming:"Aankomend",no_tasks:"Geen taken gevonden",done:"Voltooid",last_performed:"Laatst uitgevoerd",progress:"Voortgang",history:"Geschiedenis",complete:"Voltooien",remove:"Verwijderen",all_caught_up:"Alles bijgewerkt",needs_attention:"{count, plural, one {1 taak vraagt aandacht} other {# taken vragen aandacht}}",done_today:"Vandaag gedaan",repeats:"Herhaling",next_due:"Volgende keer: {date}",clear_search:"Zoekopdracht wissen",group_by:"Groeperen op",by_status:"Status"},empty:{title:"Nog geen taken",message:"Voeg je eerste taak toe of begin met de sjabloonbibliotheek met veelvoorkomende huishoudelijke taken.",message_readonly:"Taken die een beheerder toevoegt, verschijnen hier."}},Sa={categories:{hvac:"Verwarming & airco",plumbing:"Sanitair",electrical:"Elektra",appliances:"Apparaten",interior:"Binnen",exterior:"Buiten",yard:"Tuin",safety:"Veiligheid",vehicles:"Voertuigen"}},Aa={common:wa,intervals:xa,trigger_types:ka,notifications:Ta,card:Ea,panel:$a,templates:Sa};var xt={};O(xt,{card:()=>Ra,common:()=>Ca,default:()=>Ba,intervals:()=>Da,notifications:()=>Ia,panel:()=>Ha,templates:()=>La,trigger_types:()=>za});var Ca={loading:"\u0141adowanie...",none:"Brak",no_tasks:"Nie znaleziono zada\u0144.",ungrouped:"Bez grupy",cancel:"Anuluj",invalid_date:"Wprowadzono nieprawid\u0142ow\u0105 dat\u0119."},Da={day:"Dzie\u0144",days:"Dni",week:"Tydzie\u0144",weeks:"Tygodnie",month:"Miesi\u0105c",months:"Miesi\u0105ce",year:"Rok",years:"Lata",every_uses:"Co {value} u\u017Cy\u0107",every_runtime:"Co {value} czasu pracy"},za={time:"Na podstawie czasu",date:"Sta\u0142a data",count:"Na podstawie liczby u\u017Cy\u0107",runtime:"Na podstawie czasu pracy"},Ia={when:{due:"Termin",overdue:"Po terminie",due_and_overdue:"Termin i po terminie"}},Ra={add_task:{added:'Dodano "{title}".',admin_only:"Tylko administratorzy mog\u0105 dodawa\u0107 zadania."}},Ha={cards:{new:{title:"Utw\xF3rz nowe zadanie",fields:{title:{heading:"Tytu\u0142 zadania"},interval_value:{heading:"Interwa\u0142"},interval_type:{heading:"Typ interwa\u0142u"},last_performed:{heading:"Ostatnio wykonane",helper:"Pozostaw puste, aby u\u017Cy\u0107 dzisiejszej daty"},anchor_date:{heading:"Data odniesienia",helper:"Harmonogram powtarza si\u0119 od tej sta\u0142ej daty"},tag:{heading:"Tag"},icon:{heading:"Ikona"},label:{heading:"Etykieta(-y)"},area:{heading:"Obszar"},description:{heading:"Opis"},trigger_type:{heading:"Typ wyzwalacza"},count_entity_id:{heading:"Zliczana encja"},count_threshold:{heading:"Pr\xF3g liczby u\u017Cy\u0107"},runtime_entity_id:{heading:"Czujnik czasu pracy"},runtime_threshold:{heading:"Pr\xF3g czasu pracy"},group_id:{heading:"Grupa",helper:"Wybierz grup\u0119 lub wpisz now\u0105 nazw\u0119"},notifications_enabled:{heading:"W\u0142\u0105cz powiadomienia"},notification_target:{heading:"Us\u0142uga powiadomie\u0144",helper:"Pozostaw puste, aby u\u017Cy\u0107 notify.notify"},notify_when:{heading:"Powiadamiaj, gdy"},notify_days_before_due:{heading:"Dni przed terminem",helper:"Opcjonalne wyprzedzenie przypomnienia o zbli\u017Caj\u0105cym si\u0119 terminie"},notification_time:{heading:"Pora dnia",helper:"Kiedy wysy\u0142ane s\u0105 automatyczne powiadomienia"},notification_url:{heading:"Adres URL do otwarcia",helper:"Opcjonalny adres URL dla akcji Otw\xF3rz w powiadomieniu"},active_months:{heading:"Aktywne miesi\u0105ce",helper:"Zadania sezonowe s\u0105 wymagane tylko w tych miesi\u0105cach (puste = ca\u0142y rok)"}},sections:{optional:"Ustawienia opcjonalne",notifications:"Powiadomienia"},actions:{add_task:"Dodaj zadanie"},alerts:{required:"Wype\u0142nij wszystkie pola",error:"B\u0142\u0105d podczas dodawania zadania. Szczeg\xF3\u0142y w konsoli."}},current:{next:"Nast\u0119pny termin",actions:{edit:"Edytuj",move:"Przenie\u015B do grupy",remove:"Usu\u0144"},alerts:{complete_success:'"{title}" oznaczono jako wykonane. Nast\u0119pny termin zosta\u0142 przeliczony.',complete_error:"Nie uda\u0142o si\u0119 oznaczy\u0107 zadania jako wykonane. Szczeg\xF3\u0142y w konsoli.",remove_error:"Nie uda\u0142o si\u0119 usun\u0105\u0107 zadania. Szczeg\xF3\u0142y w konsoli."},filter:{search:"Szukaj zada\u0144...",templates:"Przegl\u0105daj szablony",export:"Eksportuj CSV",clear:"Wyczy\u015B\u0107 filtry"}},groups:{title:"Grupy",fields:{new_group:{heading:"Nowa grupa"}},actions:{create:"Utw\xF3rz",rename:"Zmie\u0144 nazw\u0119",delete:"Usu\u0144",save:"Zapisz"},empty:"Brak grup. Utw\xF3rz grup\u0119, aby uporz\u0105dkowa\u0107 zadania.",confirm_delete:'Usun\u0105\u0107 grup\u0119 "{title}"? Jej zadania trafi\u0105 do kategorii Bez grupy.',alerts:{error:"Nie uda\u0142o si\u0119 utworzy\u0107 grupy. Sprawd\u017A konsol\u0119 przegl\u0105darki i logi Home Assistant.",exists:'Grupa "{title}" ju\u017C istnieje.',rename_error:"Nie uda\u0142o si\u0119 zmieni\u0107 nazwy grupy. Szczeg\xF3\u0142y w konsoli.",delete_error:"Nie uda\u0142o si\u0119 usun\u0105\u0107 grupy. Szczeg\xF3\u0142y w konsoli."},confirm_delete_title:"Usu\u0144 grup\u0119"}},dialog:{edit_task:{title:"Edytuj zadanie",fields:{interval_value:{heading:"Interwa\u0142"},interval_type:{heading:"Typ interwa\u0142u"},last_performed:{heading:"Ostatnio wykonane",helper:"Pozostaw puste, aby u\u017Cy\u0107 dzisiejszej daty"},anchor_date:{heading:"Data odniesienia",helper:"Harmonogram powtarza si\u0119 od tej sta\u0142ej daty"},tag:{heading:"Tag"},icon:{heading:"Ikona"},label:{heading:"Etykieta(-y)"},area:{heading:"Obszar"},trigger_type:{heading:"Typ wyzwalacza"},count_entity_id:{heading:"Zliczana encja"},count_threshold:{heading:"Pr\xF3g liczby u\u017Cy\u0107"},runtime_entity_id:{heading:"Czujnik czasu pracy"},runtime_threshold:{heading:"Pr\xF3g czasu pracy"},title:{heading:"Tytu\u0142"},description:{heading:"Opis"},group_id:{heading:"Grupa",helper:"Wybierz grup\u0119 lub wpisz now\u0105 nazw\u0119"},notifications_enabled:{heading:"W\u0142\u0105cz powiadomienia"},notification_target:{heading:"Us\u0142uga powiadomie\u0144",helper:"Pozostaw puste, aby u\u017Cy\u0107 notify.notify"},notify_when:{heading:"Powiadamiaj, gdy"},notify_days_before_due:{heading:"Dni przed terminem",helper:"Opcjonalne wyprzedzenie przypomnienia o zbli\u017Caj\u0105cym si\u0119 terminie"},notification_time:{heading:"Pora dnia",helper:"Kiedy wysy\u0142ane s\u0105 automatyczne powiadomienia"},notification_url:{heading:"Adres URL do otwarcia",helper:"Opcjonalny adres URL dla akcji Otw\xF3rz w powiadomieniu"},active_months:{heading:"Aktywne miesi\u0105ce",helper:"Zadania sezonowe s\u0105 wymagane tylko w tych miesi\u0105cach (puste = ca\u0142y rok)"}},sections:{optional:"Ustawienia opcjonalne",notifications:"Powiadomienia",history:"Historia"},actions:{cancel:"Anuluj",save:"Zapisz",test_notification:"Wy\u015Blij powiadomienie testowe"},alerts:{error:"Nie uda\u0142o si\u0119 zapisa\u0107 zmian. Szczeg\xF3\u0142y w konsoli.",test_error:"Nie uda\u0142o si\u0119 wys\u0142a\u0107 powiadomienia testowego. Szczeg\xF3\u0142y w konsoli."}},move_task:{title:"Przenie\u015B zadanie",fields:{group_id:{heading:"Grupa"}},actions:{cancel:"Anuluj",move:"Przenie\u015B"}},confirm_complete:{title:"Oznacz zadanie jako wykonane",message:'Oznaczy\u0107 "{title}" jako wykonane? Data ostatniego wykonania zostanie ustawiona na dzi\u015B, a nast\u0119pny termin zostanie przeliczony na podstawie interwa\u0142u {interval}.',message_progress:'Oznaczy\u0107 "{title}" jako wykonane? Post\u0119p ({interval}) zacznie si\u0119 od nowa.',note_label:"Notatka (opcjonalnie)",actions:{confirm:"Oznacz jako wykonane"}},confirm_remove:{title:"Usu\u0144 zadanie",message:'Usun\u0105\u0107 "{title}"? Tej operacji nie mo\u017Cna cofn\u0105\u0107.',actions:{confirm:"Usu\u0144"}},templates:{title:"Szablony zada\u0144",search:"Szukaj szablon\xF3w...",import_csv:"Importuj z CSV",choose_csv:"Wybierz plik CSV",csv_hint:"Kolumny: title (wymagana), description, interval_value, interval_type, last_performed (RRRR-MM-DD), icon, group_id",csv_empty:"Nie znaleziono wierszy do zaimportowania.",no_matches:"\u017Baden szablon nie pasuje do wyszukiwania.",import_count:"{count, plural, one {Importuj 1 zadanie} few {Importuj # zadania} many {Importuj # zada\u0144} other {Importuj # zadania}}",imported:"{count, plural, one {Zaimportowano 1 zadanie.} few {Zaimportowano # zadania.} many {Zaimportowano # zada\u0144.} other {Zaimportowano # zadania.}}",import_failed:"Nie uda\u0142o si\u0119 zaimportowa\u0107: {titles}",preview:{title:"Tytu\u0142",interval:"Interwa\u0142",last_performed:"Ostatnio wykonano",group:"Grupa"}}},toolbar:{add_task:"Dodaj zadanie",manage_groups:"Zarz\u0105dzaj grupami"},nav:{all_tasks:"Wszystkie zadania",done_editing:"Gotowe"},list:{due_today:"Termin dzisiaj",days_overdue:"{count, plural, one {1 dzie\u0144 po terminie} few {# dni po terminie} many {# dni po terminie} other {# dnia po terminie}}",days_left:"{count, plural, one {Termin za 1 dzie\u0144} few {Zosta\u0142y # dni} many {Zosta\u0142o # dni} other {Zosta\u0142o # dnia}}",search:"Szukaj zada\u0144...",all_groups:"Wszystkie grupy",overdue:"Po terminie",due_soon:"Wkr\xF3tce termin",upcoming:"Nadchodz\u0105ce",no_tasks:"Nie znaleziono zada\u0144",done:"Wykonane",last_performed:"Ostatnio wykonane",progress:"Post\u0119p",history:"Historia",complete:"Wykonane",remove:"Usu\u0144",all_caught_up:"Wszystko zrobione",needs_attention:"{count, plural, one {1 zadanie wymaga uwagi} few {# zadania wymagaj\u0105 uwagi} many {# zada\u0144 wymaga uwagi} other {# zadania wymaga uwagi}}",done_today:"Zrobione dzisiaj",repeats:"Powtarzanie",next_due:"Nast\u0119pny termin: {date}",clear_search:"Wyczy\u015B\u0107 wyszukiwanie",group_by:"Grupuj wed\u0142ug",by_status:"Status"},empty:{title:"Brak zada\u0144",message:"Dodaj pierwsze zadanie lub zacznij od biblioteki szablon\xF3w typowych prac domowych.",message_readonly:"Zadania dodane przez administratora pojawi\u0105 si\u0119 tutaj."}},La={categories:{hvac:"Ogrzewanie i klimatyzacja",plumbing:"Hydraulika",electrical:"Elektryka",appliances:"Sprz\u0119t AGD",interior:"Wn\u0119trze",exterior:"Na zewn\u0105trz",yard:"Ogr\xF3d",safety:"Bezpiecze\u0144stwo",vehicles:"Pojazdy"}},Ba={common:Ca,intervals:Da,trigger_types:za,notifications:Ia,card:Ra,panel:Ha,templates:La};var kt={};O(kt,{card:()=>Oa,common:()=>Na,default:()=>ja,intervals:()=>Pa,notifications:()=>Ma,panel:()=>Ua,templates:()=>Ga,trigger_types:()=>Fa});var Na={loading:"Carregando...",none:"Nenhum",no_tasks:"Nenhuma tarefa encontrada.",ungrouped:"Sem grupo",cancel:"Cancelar",invalid_date:"Data inv\xE1lida."},Pa={day:"Dia",days:"Dias",week:"Semana",weeks:"Semanas",month:"M\xEAs",months:"Meses",year:"Ano",years:"Anos",every_uses:"A cada {value} usos",every_runtime:"A cada {value} de tempo de uso"},Fa={time:"Por tempo",date:"Data fixa",count:"Por contagem",runtime:"Por tempo de uso"},Ma={when:{due:"No vencimento",overdue:"Em atraso",due_and_overdue:"No vencimento e em atraso"}},Oa={add_task:{added:'"{title}" adicionada.',admin_only:"Somente administradores podem adicionar tarefas."}},Ua={cards:{new:{title:"Criar nova tarefa",fields:{title:{heading:"T\xEDtulo da tarefa"},interval_value:{heading:"Intervalo"},interval_type:{heading:"Tipo de intervalo"},last_performed:{heading:"\xDAltima execu\xE7\xE3o",helper:"Deixe em branco para usar hoje"},anchor_date:{heading:"Data de refer\xEAncia",helper:"O agendamento se repete a partir desta data fixa"},tag:{heading:"Tag"},icon:{heading:"\xCDcone"},label:{heading:"Etiqueta(s)"},area:{heading:"\xC1rea"},description:{heading:"Descri\xE7\xE3o"},trigger_type:{heading:"Tipo de gatilho"},count_entity_id:{heading:"Entidade contada"},count_threshold:{heading:"Limite de contagem"},runtime_entity_id:{heading:"Sensor de tempo de uso"},runtime_threshold:{heading:"Limite de tempo de uso"},group_id:{heading:"Grupo",helper:"Escolha um grupo ou digite um novo nome"},notifications_enabled:{heading:"Ativar notifica\xE7\xF5es"},notification_target:{heading:"Servi\xE7o de notifica\xE7\xE3o",helper:"Deixe em branco para usar notify.notify"},notify_when:{heading:"Notificar quando"},notify_days_before_due:{heading:"Dias antes do vencimento",helper:"Anteced\xEAncia opcional do lembrete de vencimento"},notification_time:{heading:"Hor\xE1rio do dia",helper:"Quando as notifica\xE7\xF5es autom\xE1ticas s\xE3o enviadas"},notification_url:{heading:"URL para abrir",helper:"URL opcional para a a\xE7\xE3o Abrir da notifica\xE7\xE3o"},active_months:{heading:"Meses ativos",helper:"Tarefas sazonais s\xF3 vencem nesses meses (vazio = o ano todo)"}},sections:{optional:"Configura\xE7\xF5es opcionais",notifications:"Notifica\xE7\xF5es"},actions:{add_task:"Adicionar tarefa"},alerts:{required:"Preencha todos os campos",error:"Erro ao adicionar a tarefa. Veja o console para detalhes."}},current:{next:"Pr\xF3ximo vencimento",actions:{edit:"Editar",move:"Mover para grupo",remove:"Remover"},alerts:{complete_success:'"{title}" marcada como conclu\xEDda. O pr\xF3ximo vencimento foi recalculado.',complete_error:"Falha ao marcar a tarefa como conclu\xEDda. Veja o console para detalhes.",remove_error:"Falha ao remover a tarefa. Veja o console para detalhes."},filter:{search:"Pesquisar tarefas...",templates:"Explorar modelos",export:"Exportar CSV",clear:"Limpar filtros"}},groups:{title:"Grupos",fields:{new_group:{heading:"Novo grupo"}},actions:{create:"Criar",rename:"Renomear",delete:"Excluir",save:"Salvar"},empty:"Nenhum grupo ainda. Crie um para organizar suas tarefas.",confirm_delete:'Excluir o grupo "{title}"? Suas tarefas ir\xE3o para Sem grupo.',alerts:{error:"Falha ao criar o grupo. Verifique o console do navegador e os logs do Home Assistant.",exists:'O grupo "{title}" j\xE1 existe.',rename_error:"Falha ao renomear o grupo. Veja o console para detalhes.",delete_error:"Falha ao excluir o grupo. Veja o console para detalhes."},confirm_delete_title:"Excluir grupo"}},dialog:{edit_task:{title:"Editar tarefa",fields:{interval_value:{heading:"Intervalo"},interval_type:{heading:"Tipo de intervalo"},last_performed:{heading:"\xDAltima execu\xE7\xE3o",helper:"Deixe em branco para usar hoje"},anchor_date:{heading:"Data de refer\xEAncia",helper:"O agendamento se repete a partir desta data fixa"},tag:{heading:"Tag"},icon:{heading:"\xCDcone"},label:{heading:"Etiqueta(s)"},area:{heading:"\xC1rea"},trigger_type:{heading:"Tipo de gatilho"},count_entity_id:{heading:"Entidade contada"},count_threshold:{heading:"Limite de contagem"},runtime_entity_id:{heading:"Sensor de tempo de uso"},runtime_threshold:{heading:"Limite de tempo de uso"},title:{heading:"T\xEDtulo"},description:{heading:"Descri\xE7\xE3o"},group_id:{heading:"Grupo",helper:"Escolha um grupo ou digite um novo nome"},notifications_enabled:{heading:"Ativar notifica\xE7\xF5es"},notification_target:{heading:"Servi\xE7o de notifica\xE7\xE3o",helper:"Deixe em branco para usar notify.notify"},notify_when:{heading:"Notificar quando"},notify_days_before_due:{heading:"Dias antes do vencimento",helper:"Anteced\xEAncia opcional do lembrete de vencimento"},notification_time:{heading:"Hor\xE1rio do dia",helper:"Quando as notifica\xE7\xF5es autom\xE1ticas s\xE3o enviadas"},notification_url:{heading:"URL para abrir",helper:"URL opcional para a a\xE7\xE3o Abrir da notifica\xE7\xE3o"},active_months:{heading:"Meses ativos",helper:"Tarefas sazonais s\xF3 vencem nesses meses (vazio = o ano todo)"}},sections:{optional:"Configura\xE7\xF5es opcionais",notifications:"Notifica\xE7\xF5es",history:"Hist\xF3rico"},actions:{cancel:"Cancelar",save:"Salvar",test_notification:"Enviar notifica\xE7\xE3o de teste"},alerts:{error:"Falha ao salvar as altera\xE7\xF5es. Veja o console para detalhes.",test_error:"Falha ao enviar a notifica\xE7\xE3o de teste. Veja o console para detalhes."}},move_task:{title:"Mover tarefa",fields:{group_id:{heading:"Grupo"}},actions:{cancel:"Cancelar",move:"Mover"}},confirm_complete:{title:"Marcar tarefa como conclu\xEDda",message:'Marcar "{title}" como conclu\xEDda? A \xFAltima execu\xE7\xE3o ser\xE1 redefinida para hoje e o pr\xF3ximo vencimento ser\xE1 recalculado com base no intervalo de {interval}.',message_progress:'Marcar "{title}" como conclu\xEDda? O progresso ({interval}) recome\xE7ar\xE1 do zero.',note_label:"Nota (opcional)",actions:{confirm:"Marcar como conclu\xEDda"}},confirm_remove:{title:"Remover tarefa",message:'Remover "{title}"? Isso n\xE3o pode ser desfeito.',actions:{confirm:"Remover"}},templates:{title:"Modelos de tarefas",search:"Pesquisar modelos...",import_csv:"Importar de CSV",choose_csv:"Escolher arquivo CSV",csv_hint:"Colunas: title (obrigat\xF3ria), description, interval_value, interval_type, last_performed (AAAA-MM-DD), icon, group_id",csv_empty:"Nenhuma linha import\xE1vel encontrada no arquivo.",no_matches:"Nenhum modelo corresponde \xE0 sua pesquisa.",import_count:"{count, plural, one {Importar 1 tarefa} other {Importar # tarefas}}",imported:"{count, plural, one {1 tarefa importada.} other {# tarefas importadas.}}",import_failed:"Falha ao importar: {titles}",preview:{title:"T\xEDtulo",interval:"Intervalo",last_performed:"\xDAltima execu\xE7\xE3o",group:"Grupo"}}},toolbar:{add_task:"Adicionar tarefa",manage_groups:"Gerenciar grupos"},nav:{all_tasks:"Todas as tarefas",done_editing:"Concluir"},list:{due_today:"Vence hoje",days_overdue:"{count, plural, one {1 dia de atraso} other {# dias de atraso}}",days_left:"{count, plural, one {Vence em 1 dia} other {Faltam # dias}}",search:"Pesquisar tarefas...",all_groups:"Todos os grupos",overdue:"Atrasadas",due_soon:"Vence em breve",upcoming:"Pr\xF3ximas",no_tasks:"Nenhuma tarefa encontrada",done:"Conclu\xEDdas",last_performed:"\xDAltima execu\xE7\xE3o",progress:"Progresso",history:"Hist\xF3rico",complete:"Concluir",remove:"Remover",all_caught_up:"Tudo em dia",needs_attention:"{count, plural, one {1 tarefa precisa de aten\xE7\xE3o} other {# tarefas precisam de aten\xE7\xE3o}}",done_today:"Feito hoje",repeats:"Repete",next_due:"Pr\xF3ximo vencimento: {date}",clear_search:"Limpar busca",group_by:"Agrupar por",by_status:"Status"},empty:{title:"Nenhuma tarefa ainda",message:"Adicione sua primeira tarefa ou comece pela biblioteca de modelos de tarefas dom\xE9sticas comuns.",message_readonly:"As tarefas adicionadas por um administrador aparecer\xE3o aqui."}},Ga={categories:{hvac:"Climatiza\xE7\xE3o",plumbing:"Hidr\xE1ulica",electrical:"El\xE9trica",appliances:"Eletrodom\xE9sticos",interior:"Interior",exterior:"Exterior",yard:"Jardim",safety:"Seguran\xE7a",vehicles:"Ve\xEDculos"}},ja={common:Na,intervals:Pa,trigger_types:Fa,notifications:Ma,card:Oa,panel:Ua,templates:Ga};function Ne(t,i){let e=i&&i.cache?i.cache:Ja,r=i&&i.serializer?i.serializer:Xa;return(i&&i.strategy?i.strategy:qa)(t,{cache:e,serializer:r})}function Va(t){return t==null||typeof t=="number"||typeof t=="boolean"}function ui(t,i,e,r){let a=Va(r)?r:e(r),n=i.get(a);return typeof n>"u"&&(n=t.call(this,r),i.set(a,n)),n}function hi(t,i,e){let r=Array.prototype.slice.call(arguments,3),a=e(r),n=i.get(a);return typeof n>"u"&&(n=t.apply(this,r),i.set(a,n)),n}function Tt(t,i,e,r,a){return e.bind(i,t,r,a)}function qa(t,i){let e=t.length===1?ui:hi;return Tt(t,this,e,i.cache.create(),i.serializer)}function Wa(t,i){return Tt(t,this,hi,i.cache.create(),i.serializer)}function Za(t,i){return Tt(t,this,ui,i.cache.create(),i.serializer)}var Xa=function(){return JSON.stringify(arguments)},Ya=class{constructor(){this.cache=Object.create(null)}get(t){return this.cache[t]}set(t,i){this.cache[t]=i}},Ja={create:function(){return new Ya}},Pe={variadic:Wa,monadic:Za};var Qa=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function fi(t){let i={};return t.replace(Qa,e=>{let r=e.length;switch(e[0]){case"G":i.era=r===4?"long":r===5?"narrow":"short";break;case"y":i.year=r===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":i.month=["numeric","2-digit","short","long","narrow"][r-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":i.day=["numeric","2-digit"][r-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":i.weekday=r===4?"long":r===5?"narrow":"short";break;case"e":if(r<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");i.weekday=["short","long","narrow","short"][r-3];break;case"c":if(r<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");i.weekday=["short","long","narrow","short"][r-3];break;case"a":i.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":i.hourCycle="h12",i.hour=["numeric","2-digit"][r-1];break;case"H":i.hourCycle="h23",i.hour=["numeric","2-digit"][r-1];break;case"K":i.hourCycle="h11",i.hour=["numeric","2-digit"][r-1];break;case"k":i.hourCycle="h24",i.hour=["numeric","2-digit"][r-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":i.minute=["numeric","2-digit"][r-1];break;case"s":i.second=["numeric","2-digit"][r-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":i.timeZoneName=r<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),i}var Ka=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function _i(t){if(t.length===0)throw new Error("Number skeleton cannot be empty");let i=t.split(Ka).filter(r=>r.length>0),e=[];for(let r of i){let a=r.split("/");if(a.length===0)throw new Error("Invalid number skeleton");let[n,...o]=a;for(let l of o)if(l.length===0)throw new Error("Invalid number skeleton");e.push({stem:n,options:o})}return e}function en(t){return t.replace(/^(.*?)-/,"")}var pi=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,yi=/^(@+)?(\+|#+)?[rs]?$/g,tn=/(\*)(0+)|(#+)(0+)|(0+)/g,vi=/^(0+)$/;function mi(t){let i={};return t[t.length-1]==="r"?i.roundingPriority="morePrecision":t[t.length-1]==="s"&&(i.roundingPriority="lessPrecision"),t.replace(yi,function(e,r,a){return typeof a!="string"?(i.minimumSignificantDigits=r.length,i.maximumSignificantDigits=r.length):a==="+"?i.minimumSignificantDigits=r.length:r[0]==="#"?i.maximumSignificantDigits=r.length:(i.minimumSignificantDigits=r.length,i.maximumSignificantDigits=r.length+(typeof a=="string"?a.length:0)),""}),i}function bi(t){switch(t){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function rn(t){let i;if(t[0]==="E"&&t[1]==="E"?(i={notation:"engineering"},t=t.slice(2)):t[0]==="E"&&(i={notation:"scientific"},t=t.slice(1)),i){let e=t.slice(0,2);if(e==="+!"?(i.signDisplay="always",t=t.slice(2)):e==="+?"&&(i.signDisplay="exceptZero",t=t.slice(2)),!vi.test(t))throw new Error("Malformed concise eng/scientific notation");i.minimumIntegerDigits=t.length}return i}function gi(t){let i={},e=bi(t);return e||i}function wi(t){let i={};for(let e of t){switch(e.stem){case"percent":case"%":i.style="percent";continue;case"%x100":i.style="percent",i.scale=100;continue;case"currency":i.style="currency",i.currency=e.options[0];continue;case"group-off":case",_":i.useGrouping=!1;continue;case"precision-integer":case".":i.maximumFractionDigits=0;continue;case"measure-unit":case"unit":i.style="unit",i.unit=en(e.options[0]);continue;case"compact-short":case"K":i.notation="compact",i.compactDisplay="short";continue;case"compact-long":case"KK":i.notation="compact",i.compactDisplay="long";continue;case"scientific":i={...i,notation:"scientific",...e.options.reduce((n,o)=>({...n,...gi(o)}),{})};continue;case"engineering":i={...i,notation:"engineering",...e.options.reduce((n,o)=>({...n,...gi(o)}),{})};continue;case"notation-simple":i.notation="standard";continue;case"unit-width-narrow":i.currencyDisplay="narrowSymbol",i.unitDisplay="narrow";continue;case"unit-width-short":i.currencyDisplay="code",i.unitDisplay="short";continue;case"unit-width-full-name":i.currencyDisplay="name",i.unitDisplay="long";continue;case"unit-width-iso-code":i.currencyDisplay="symbol";continue;case"scale":i.scale=parseFloat(e.options[0]);continue;case"rounding-mode-floor":i.roundingMode="floor";continue;case"rounding-mode-ceiling":i.roundingMode="ceil";continue;case"rounding-mode-down":i.roundingMode="trunc";continue;case"rounding-mode-up":i.roundingMode="expand";continue;case"rounding-mode-half-even":i.roundingMode="halfEven";continue;case"rounding-mode-half-down":i.roundingMode="halfTrunc";continue;case"rounding-mode-half-up":i.roundingMode="halfExpand";continue;case"integer-width":if(e.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");e.options[0].replace(tn,function(n,o,l,s,m,g){if(o)i.minimumIntegerDigits=l.length;else{if(s&&m)throw new Error("We currently do not support maximum integer digits");if(g)throw new Error("We currently do not support exact integer digits")}return""});continue}if(vi.test(e.stem)){i.minimumIntegerDigits=e.stem.length;continue}if(pi.test(e.stem)){if(e.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");e.stem.replace(pi,function(o,l,s,m,g,u){return s==="*"?i.minimumFractionDigits=l.length:m&&m[0]==="#"?i.maximumFractionDigits=m.length:g&&u?(i.minimumFractionDigits=g.length,i.maximumFractionDigits=g.length+u.length):(i.minimumFractionDigits=l.length,i.maximumFractionDigits=l.length),""});let n=e.options[0];n==="w"?i={...i,trailingZeroDisplay:"stripIfInteger"}:n&&(i={...i,...mi(n)});continue}if(yi.test(e.stem)){i={...i,...mi(e.stem)};continue}let r=bi(e.stem);r&&(i={...i,...r});let a=rn(e.stem);a&&(i={...i,...a})}return i}var an=(function(t){return t[t.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",t[t.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",t[t.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",t[t.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",t[t.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",t[t.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",t[t.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",t[t.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",t[t.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",t[t.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",t[t.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",t[t.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",t[t.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",t[t.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",t[t.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",t[t.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",t[t.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",t[t.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",t[t.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",t[t.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",t[t.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",t[t.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",t[t.INVALID_TAG=23]="INVALID_TAG",t[t.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",t[t.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",t[t.UNCLOSED_TAG=27]="UNCLOSED_TAG",t})({});function St(t){return t.type===0}function Ti(t){return t.type===1}function At(t){return t.type===2}function Ct(t){return t.type===3}function Dt(t){return t.type===4}function zt(t){return t.type===5}function It(t){return t.type===6}function Ei(t){return t.type===7}function Rt(t){return t.type===8}function Ht(t){return!!(t&&typeof t=="object"&&t.type===0)}function Fe(t){return!!(t&&typeof t=="object"&&t.type===1)}var $i=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/,nn=/([^\t-\r -\/:-@\[-\^`\{-~\x85\xA0-\xA7\xA9\xAB\xAC\xAE\xB0\xB1\xB6\xBB\xBF\xD7\xF7\u1680\u2000-\u200A\u2010-\u2029\u202F-\u203E\u2041-\u2053\u2055-\u205F\u2190-\u245F\u2500-\u2775\u2794-\u2BFF\u2E00-\u2E7F\u3000-\u3003\u3008-\u3020\u3030\uFD3E\uFD3F\uFE45\uFE46]*)/g,Te={"001":["H","h"],419:["h","H","hB","hb"],AC:["H","h","hb","hB"],AD:["H","hB"],AE:["h","hB","hb","H"],AF:["H","hb","hB","h"],AG:["h","hb","H","hB"],AI:["H","h","hb","hB"],AL:["h","H","hB"],AM:["H","hB"],AO:["H","hB"],AR:["h","H","hB","hb"],AS:["h","H"],AT:["H","hB"],AU:["h","hb","H","hB"],AW:["H","hB"],AX:["H"],AZ:["H","hB","h"],BA:["H","hB","h"],BB:["h","hb","H","hB"],BD:["h","hB","H"],BE:["H","hB"],BF:["H","hB"],BG:["H","hB","h"],BH:["h","hB","hb","H"],BI:["H","h"],BJ:["H","hB"],BL:["H","hB"],BM:["h","hb","H","hB"],BN:["hb","hB","h","H"],BO:["h","H","hB","hb"],BQ:["H"],BR:["H","hB"],BS:["h","hb","H","hB"],BT:["h","H"],BW:["H","h","hb","hB"],BY:["H","h"],BZ:["H","h","hb","hB"],CA:["h","hb","H","hB"],CC:["H","h","hb","hB"],CD:["hB","H"],CF:["H","h","hB"],CG:["H","hB"],CH:["H","hB","h"],CI:["H","hB"],CK:["H","h","hb","hB"],CL:["h","H","hB","hb"],CM:["H","h","hB"],CN:["H","hB","hb","h"],CO:["h","H","hB","hb"],CP:["H"],CR:["h","H","hB","hb"],CU:["h","H","hB","hb"],CV:["H","hB"],CW:["H","hB"],CX:["H","h","hb","hB"],CY:["h","H","hb","hB"],CZ:["H"],DE:["H","hB"],DG:["H","h","hb","hB"],DJ:["h","H"],DK:["H"],DM:["h","hb","H","hB"],DO:["h","H","hB","hb"],DZ:["h","hB","hb","H"],EA:["H","h","hB","hb"],EC:["h","H","hB","hb"],EE:["H","hB"],EG:["h","hB","hb","H"],EH:["h","hB","hb","H"],ER:["h","H"],ES:["H","hB","h","hb"],ET:["hB","hb","h","H"],FI:["H"],FJ:["h","hb","H","hB"],FK:["H","h","hb","hB"],FM:["h","hb","H","hB"],FO:["H","h"],FR:["H","hB"],GA:["H","hB"],GB:["H","h","hb","hB"],GD:["h","hb","H","hB"],GE:["H","hB","h"],GF:["H","hB"],GG:["H","h","hb","hB"],GH:["h","H"],GI:["H","h","hb","hB"],GL:["H","h"],GM:["h","hb","H","hB"],GN:["H","hB"],GP:["H","hB"],GQ:["H","hB","h","hb"],GR:["h","H","hb","hB"],GS:["H","h","hb","hB"],GT:["h","H","hB","hb"],GU:["h","hb","H","hB"],GW:["H","hB"],GY:["h","hb","H","hB"],HK:["h","hB","hb","H"],HN:["h","H","hB","hb"],HR:["H","hB"],HU:["H","h"],IC:["H","h","hB","hb"],ID:["H"],IE:["H","h","hb","hB"],IL:["H","hB"],IM:["H","h","hb","hB"],IN:["h","H"],IO:["H","h","hb","hB"],IQ:["h","hB","hb","H"],IR:["hB","H"],IS:["H"],IT:["H","hB"],JE:["H","h","hb","hB"],JM:["h","hb","H","hB"],JO:["h","hB","hb","H"],JP:["H","K","h"],KE:["hB","hb","H","h"],KG:["H","h","hB","hb"],KH:["hB","h","H","hb"],KI:["h","hb","H","hB"],KM:["H","h","hB","hb"],KN:["h","hb","H","hB"],KP:["h","H","hB","hb"],KR:["h","H","hB","hb"],KW:["h","hB","hb","H"],KY:["h","hb","H","hB"],KZ:["H","hB"],LA:["H","hb","hB","h"],LB:["h","hB","hb","H"],LC:["h","hb","H","hB"],LI:["H","hB","h"],LK:["H","h","hB","hb"],LR:["h","hb","H","hB"],LS:["h","H"],LT:["H","h","hb","hB"],LU:["H","h","hB"],LV:["H","hB","hb","h"],LY:["h","hB","hb","H"],MA:["H","h","hB","hb"],MC:["H","hB"],MD:["H","hB"],ME:["H","hB","h"],MF:["H","hB"],MG:["H","h"],MH:["h","hb","H","hB"],MK:["H","h","hb","hB"],ML:["H"],MM:["hB","hb","H","h"],MN:["H","h","hb","hB"],MO:["h","hB","hb","H"],MP:["h","hb","H","hB"],MQ:["H","hB"],MR:["h","hB","hb","H"],MS:["H","h","hb","hB"],MT:["H","h"],MU:["H","h"],MV:["H","h"],MW:["h","hb","H","hB"],MX:["h","H","hB","hb"],MY:["hb","hB","h","H"],MZ:["H","hB"],NA:["h","H","hB","hb"],NC:["H","hB"],NE:["H"],NF:["H","h","hb","hB"],NG:["H","h","hb","hB"],NI:["h","H","hB","hb"],NL:["H","hB"],NO:["H","h"],NP:["H","h","hB"],NR:["H","h","hb","hB"],NU:["H","h","hb","hB"],NZ:["h","hb","H","hB"],OM:["h","hB","hb","H"],PA:["h","H","hB","hb"],PE:["h","H","hB","hb"],PF:["H","h","hB"],PG:["h","H"],PH:["h","hB","hb","H"],PK:["h","hB","H"],PL:["H","h"],PM:["H","hB"],PN:["H","h","hb","hB"],PR:["h","H","hB","hb"],PS:["h","hB","hb","H"],PT:["H","hB"],PW:["h","H"],PY:["h","H","hB","hb"],QA:["h","hB","hb","H"],RE:["H","hB"],RO:["H","hB"],RS:["H","hB","h"],RU:["H"],RW:["H","h"],SA:["h","hB","hb","H"],SB:["h","hb","H","hB"],SC:["H","h","hB"],SD:["h","hB","hb","H"],SE:["H"],SG:["h","hb","H","hB"],SH:["H","h","hb","hB"],SI:["H","hB"],SJ:["H"],SK:["H"],SL:["h","hb","H","hB"],SM:["H","h","hB"],SN:["H","h","hB"],SO:["h","H"],SR:["H","hB"],SS:["h","hb","H","hB"],ST:["H","hB"],SV:["h","H","hB","hb"],SX:["H","h","hb","hB"],SY:["h","hB","hb","H"],SZ:["h","hb","H","hB"],TA:["H","h","hb","hB"],TC:["h","hb","H","hB"],TD:["h","H","hB"],TF:["H","h","hB"],TG:["H","hB"],TH:["H","h"],TJ:["H","h"],TL:["H","hB","hb","h"],TM:["H","h"],TN:["h","hB","hb","H"],TO:["h","H"],TR:["H","hB"],TT:["h","hb","H","hB"],TW:["hB","hb","h","H"],TZ:["hB","hb","H","h"],UA:["H","hB","h"],UG:["hB","hb","H","h"],UM:["h","hb","H","hB"],US:["h","hb","H","hB"],UY:["h","H","hB","hb"],UZ:["H","hB","h"],VA:["H","h","hB"],VC:["h","hb","H","hB"],VE:["h","H","hB","hb"],VG:["h","hb","H","hB"],VI:["h","hb","H","hB"],VN:["H","h"],VU:["h","H"],WF:["H","hB"],WS:["h","H"],XK:["H","hB","h"],YE:["h","hB","hb","H"],YT:["H","hB"],ZA:["H","h","hb","hB"],ZM:["h","hb","H","hB"],ZW:["H","h"],"af-ZA":["H","h","hB","hb"],"ar-001":["h","hB","hb","H"],"ca-ES":["H","h","hB"],"en-001":["h","hb","H","hB"],"en-HK":["h","hb","H","hB"],"en-IL":["H","h","hb","hB"],"en-MY":["h","hb","H","hB"],"es-BR":["H","h","hB","hb"],"es-ES":["H","h","hB","hb"],"es-GQ":["H","h","hB","hb"],"fr-CA":["H","h","hB"],"gl-ES":["H","h","hB"],"gu-IN":["hB","hb","h","H"],"hi-IN":["hB","h","H"],"it-CH":["H","h","hB"],"it-IT":["H","h","hB"],"kn-IN":["hB","h","H"],"ku-SY":["H","hB"],"ml-IN":["hB","h","H"],"mr-IN":["hB","hb","h","H"],"pa-IN":["hB","hb","h","H"],"ta-IN":["hB","h","hb","H"],"te-IN":["hB","h","H"],"zu-ZA":["H","hB","hb","h"]};function on(t,i){let e="";for(let r=0;r<t.length;r++){let a=t.charAt(r);if(a==="j"){let n=0;for(;r+1<t.length&&t.charAt(r+1)===a;)n++,r++;let o=1+(n&1),l=n<2?1:3+(n>>1),s="a",m=sn(i);for((m=="H"||m=="k")&&(l=0);l-- >0;)e+=s;for(;o-- >0;)e=m+e}else a==="J"?e+="H":e+=a}return e}function sn(t){let i=t.hourCycle;if(i===void 0){let a=t;i=a.getHourCycles?.()[0]??a.hourCycles?.[0]}if(i)switch(i){case"h24":return"k";case"h23":return"H";case"h12":return"h";case"h11":return"K";default:throw new Error("Invalid hourCycle")}let e=t.language,r;return e!=="root"&&(r=t.maximize().region),(Te[`${e}-${r}`]||Te[r||""]||Te[e||""]||Te[`${e}-001`]||Te["001"])[0].charAt(0)}var ln=new RegExp(`^${$i.source}*`),cn=new RegExp(`${$i.source}*$`);function x(t,i){return{start:t,end:i}}var dn=!!Object.fromEntries,un=!!String.prototype.trimStart,hn=!!String.prototype.trimEnd,xi=dn?Object.fromEntries:function(i){let e={};for(let[r,a]of i)e[r]=a;return e},pn=un?function(i){return i.trimStart()}:function(i){return i.replace(ln,"")},mn=hn?function(i){return i.trimEnd()}:function(i){return i.replace(cn,"")},ki=gn();function gn(){try{let t=new RegExp("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu");if(t.exec("a ")?.[1]==="a")return t}catch{}return nn}function fn(t,i){return ki.lastIndex=i,ki.exec(t)[1]??""}function _n(t){if(t.length===0)return null;let i=1,e=1;for(let r=0;r<t.length;){let a=t.charCodeAt(r);switch(a){case 35:case 39:case 60:case 123:case 125:return null}if(a===10)i++,e=1,r++;else if(e++,a>=55296&&a<=56319&&r+1<t.length){let n=t.charCodeAt(r+1);r+=n>=56320&&n<=57343?2:1}else r++}return{offset:t.length,line:i,column:e}}var yn=class{constructor(t,i={}){this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!i.ignoreTag,this.locale=i.locale,this.requiresOtherClause=!!i.requiresOtherClause,this.shouldParseSkeletons=!!i.shouldParseSkeletons}parse(){if(this.offset()!==0)throw Error("parser can only be used once");if(this.message.length>0){let t=this.message.charCodeAt(0);if(t!==35&&t!==39&&t!==60&&t!==123&&t!==125){let i=_n(this.message);if(i){let e=this.clonePosition();return this.position=i,{val:[{type:0,value:this.message,location:x(e,this.clonePosition())}],err:null}}}}return this.parseMessage(0,"",!1)}parseMessage(t,i,e){let r=[];for(;!this.isEOF();){let a=this.char();if(a===123){let n=this.parseArgument(t,e);if(n.err)return n;r.push(n.val)}else{if(a===125&&t>0)break;if(a===35&&(i==="plural"||i==="selectordinal")){let n=this.clonePosition();this.bump(),r.push({type:7,location:x(n,this.clonePosition())})}else if(a===60&&!this.ignoreTag&&this.peek()===47){if(e)break;return this.error(26,x(this.clonePosition(),this.clonePosition()))}else if(a===60&&!this.ignoreTag&&Et(this.peek()||0)){let n=this.parseTag(t,i);if(n.err)return n;r.push(n.val)}else{let n=this.parseLiteral(t,i);if(n.err)return n;r.push(n.val)}}}return{val:r,err:null}}parseTag(t,i){let e=this.clonePosition();this.bump();let r=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:0,value:`<${r}/>`,location:x(e,this.clonePosition())},err:null};if(this.bumpIf(">")){let a=this.parseMessage(t+1,i,!0);if(a.err)return a;let n=a.val,o=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!Et(this.char()))return this.error(23,x(o,this.clonePosition()));let l=this.clonePosition();return r!==this.parseTagName()?this.error(26,x(l,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:8,value:r,children:n,location:x(e,this.clonePosition())},err:null}:this.error(23,x(o,this.clonePosition())))}else return this.error(27,x(e,this.clonePosition()))}else return this.error(23,x(e,this.clonePosition()))}parseTagName(){let t=this.offset();for(this.bump();!this.isEOF()&&bn(this.char());)this.bump();return this.message.slice(t,this.offset())}parseLiteral(t,i){let e=this.clonePosition(),r="";for(;;){let n=this.tryParseQuote(i);if(n){r+=n;continue}let o=this.tryParseUnquoted(t,i);if(o){r+=o;continue}let l=this.tryParseLeftAngleBracket();if(l){r+=l;continue}break}let a=x(e,this.clonePosition());return{val:{type:0,value:r,location:a},err:null}}tryParseLeftAngleBracket(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!vn(this.peek()||0))?(this.bump(),"<"):null}tryParseQuote(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();let i=[this.char()];for(this.bump();!this.isEOF();){let e=this.char();if(e===39)if(this.peek()===39)i.push(39),this.bump();else{this.bump();break}else i.push(e);this.bump()}return String.fromCodePoint(...i)}tryParseUnquoted(t,i){if(this.isEOF())return null;let e=this.char();return e===60||e===123||e===35&&(i==="plural"||i==="selectordinal")||e===125&&t>0?null:(this.bump(),String.fromCodePoint(e))}parseArgument(t,i){let e=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(1,x(e,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(2,x(e,this.clonePosition()));let r=this.parseIdentifierIfPossible().value;if(!r)return this.error(3,x(e,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(1,x(e,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:1,value:r,location:x(e,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(1,x(e,this.clonePosition())):this.parseArgumentOptions(t,i,r,e);default:return this.error(3,x(e,this.clonePosition()))}}parseIdentifierIfPossible(){let t=this.clonePosition(),i=this.offset(),e=fn(this.message,i),r=i+e.length;return this.bumpTo(r),{value:e,location:x(t,this.clonePosition())}}parseArgumentOptions(t,i,e,r){let a=this.clonePosition(),n=this.parseIdentifierIfPossible().value,o=this.clonePosition();switch(n){case"":return this.error(4,x(a,o));case"number":case"date":case"time":{this.bumpSpace();let l=null;if(this.bumpIf(",")){this.bumpSpace();let g=this.clonePosition(),u=this.parseSimpleArgStyleIfPossible();if(u.err)return u;let _=mn(u.val);if(_.length===0)return this.error(6,x(this.clonePosition(),this.clonePosition()));l={style:_,styleLocation:x(g,this.clonePosition())}}let s=this.tryParseArgumentClose(r);if(s.err)return s;let m=x(r,this.clonePosition());if(l&&l.style.startsWith("::")){let g=pn(l.style.slice(2));if(n==="number"){let u=this.parseNumberSkeletonFromString(g,l.styleLocation);return u.err?u:{val:{type:2,value:e,location:m,style:u.val},err:null}}else{if(g.length===0)return this.error(10,m);let u=g;this.locale&&(u=on(g,this.locale));let _={type:1,pattern:u,location:l.styleLocation,parsedOptions:this.shouldParseSkeletons?fi(u):{}};return{val:{type:n==="date"?3:4,value:e,location:m,style:_},err:null}}}return{val:{type:n==="number"?2:n==="date"?3:4,value:e,location:m,style:l?.style??null},err:null}}case"plural":case"selectordinal":case"select":{let l=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(12,x(l,{...l}));this.bumpSpace();let s=this.parseIdentifierIfPossible(),m=0;if(n!=="select"&&s.value==="offset"){if(!this.bumpIf(":"))return this.error(13,x(this.clonePosition(),this.clonePosition()));this.bumpSpace();let y=this.tryParseDecimalInteger(13,14);if(y.err)return y;this.bumpSpace(),s=this.parseIdentifierIfPossible(),m=y.val}let g=this.tryParsePluralOrSelectOptions(t,n,i,s);if(g.err)return g;let u=this.tryParseArgumentClose(r);if(u.err)return u;let _=x(r,this.clonePosition());return n==="select"?{val:{type:5,value:e,options:xi(g.val),location:_},err:null}:{val:{type:6,value:e,options:xi(g.val),offset:m,pluralType:n==="plural"?"cardinal":"ordinal",location:_},err:null}}default:return this.error(5,x(a,o))}}tryParseArgumentClose(t){return this.isEOF()||this.char()!==125?this.error(1,x(t,this.clonePosition())):(this.bump(),{val:!0,err:null})}parseSimpleArgStyleIfPossible(){let t=0,i=this.clonePosition();for(;!this.isEOF();)switch(this.char()){case 39:{this.bump();let e=this.clonePosition();if(!this.bumpUntil("'"))return this.error(11,x(e,this.clonePosition()));this.bump();break}case 123:t+=1,this.bump();break;case 125:if(t>0)t-=1;else return{val:this.message.slice(i.offset,this.offset()),err:null};break;default:this.bump()}return{val:this.message.slice(i.offset,this.offset()),err:null}}parseNumberSkeletonFromString(t,i){let e=[];try{e=_i(t)}catch{return this.error(7,i)}return{val:{type:0,tokens:e,location:i,parsedOptions:this.shouldParseSkeletons?wi(e):{}},err:null}}tryParsePluralOrSelectOptions(t,i,e,r){let a=!1,n=[],o=new Set,{value:l,location:s}=r;for(;;){if(l.length===0){let _=this.clonePosition();if(i!=="select"&&this.bumpIf("=")){let y=this.tryParseDecimalInteger(16,19);if(y.err)return y;s=x(_,this.clonePosition()),l=this.message.slice(_.offset,this.offset())}else break}if(o.has(l))return this.error(i==="select"?21:20,s);l==="other"&&(a=!0),this.bumpSpace();let m=this.clonePosition();if(!this.bumpIf("{"))return this.error(i==="select"?17:18,x(this.clonePosition(),this.clonePosition()));let g=this.parseMessage(t+1,i,e);if(g.err)return g;let u=this.tryParseArgumentClose(m);if(u.err)return u;n.push([l,{value:g.val,location:x(m,this.clonePosition())}]),o.add(l),this.bumpSpace(),{value:l,location:s}=this.parseIdentifierIfPossible()}return n.length===0?this.error(i==="select"?15:16,x(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!a?this.error(22,x(this.clonePosition(),this.clonePosition())):{val:n,err:null}}tryParseDecimalInteger(t,i){let e=1,r=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(e=-1);let a=!1,n=0;for(;!this.isEOF();){let l=this.char();if(l>=48&&l<=57)a=!0,n=n*10+(l-48),this.bump();else break}let o=x(r,this.clonePosition());return a?(n*=e,Number.isSafeInteger(n)?{val:n,err:null}:this.error(i,o)):this.error(t,o)}offset(){return this.position.offset}isEOF(){return this.offset()===this.message.length}clonePosition(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}}char(){let t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");let i=this.message.codePointAt(t);if(i===void 0)throw Error(`Offset ${t} is at invalid UTF-16 code unit boundary`);return i}error(t,i){return{val:null,err:{kind:t,message:this.message,location:i}}}bump(){if(this.isEOF())return;let t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}bumpIf(t){if(this.message.startsWith(t,this.offset())){for(let i=0;i<t.length;i++)this.bump();return!0}return!1}bumpUntil(t){let i=this.offset(),e=this.message.indexOf(t,i);return e>=0?(this.bumpTo(e),!0):(this.bumpTo(this.message.length),!1)}bumpTo(t){if(this.offset()>t)throw Error(`targetOffset ${t} must be greater than or equal to the current offset ${this.offset()}`);for(t=Math.min(t,this.message.length);;){let i=this.offset();if(i===t)break;if(i>t)throw Error(`targetOffset ${t} is at invalid UTF-16 code unit boundary`);if(this.bump(),this.isEOF())break}}bumpSpace(){for(;!this.isEOF()&&wn(this.char());)this.bump()}peek(){if(this.isEOF())return null;let t=this.char(),i=this.offset();return this.message.charCodeAt(i+(t>=65536?2:1))??null}};function Et(t){return t>=97&&t<=122||t>=65&&t<=90}function vn(t){return Et(t)||t===47}function bn(t){return t===45||t===46||t>=48&&t<=57||t===95||t>=97&&t<=122||t>=65&&t<=90||t==183||t>=192&&t<=214||t>=216&&t<=246||t>=248&&t<=893||t>=895&&t<=8191||t>=8204&&t<=8205||t>=8255&&t<=8256||t>=8304&&t<=8591||t>=11264&&t<=12271||t>=12289&&t<=55295||t>=63744&&t<=64975||t>=65008&&t<=65533||t>=65536&&t<=983039}function wn(t){return t>=9&&t<=13||t===32||t===133||t>=8206&&t<=8207||t===8232||t===8233}function $t(t){t.forEach(i=>{if(delete i.location,zt(i)||It(i))for(let e in i.options)delete i.options[e].location,$t(i.options[e].value);else At(i)&&Ht(i.style)||(Ct(i)||Dt(i))&&Fe(i.style)?delete i.style.location:Rt(i)&&$t(i.children)})}function Si(t,i={}){i={shouldParseSkeletons:!0,requiresOtherClause:!0,...i};let e=new yn(t,i).parse();if(e.err){let r=SyntaxError(an[e.err.kind]);throw r.location=e.err.location,r.originalMessage=e.err.message,r}return i?.captureLocation||$t(e.val),e.val}var Oe=class extends Error{constructor(t,i,e){super(t),this.code=i,this.originalMessage=e}toString(){return`[formatjs Error: ${this.code}] ${this.message}`}},Ai=class extends Oe{constructor(t,i,e,r){super(`Invalid values for "${t}": "${i}". Options are "${Object.keys(e).join('", "')}"`,"INVALID_VALUE",r)}},xn=class extends Oe{constructor(t,i,e){super(`Value for "${t}" must be of type ${i}`,"INVALID_VALUE",e)}},kn=class extends Oe{constructor(t,i){super(`The intl string context variable "${t}" was not provided to the string "${i}"`,"MISSING_VALUE",i)}};function Tn(t){return t.length<2?t:t.reduce((i,e)=>{let r=i[i.length-1];return!r||r.type!==0||e.type!==0?i.push(e):r.value+=e.value,i},[])}function En(t){return typeof t=="function"}function Me(t,i,e,r,a,n,o){if(t.length===1&&St(t[0]))return[{type:0,value:t[0].value}];let l=[];for(let s of t){if(St(s)){l.push({type:0,value:s.value});continue}if(Ei(s)){typeof n=="number"&&l.push({type:0,value:e.getNumberFormat(i).format(n)});continue}let{value:m}=s;if(!(a&&m in a))throw new kn(m,o);let g=a[m];if(Ti(s)){(!g||typeof g=="string"||typeof g=="number"||typeof g=="bigint")&&(g=typeof g=="string"||typeof g=="number"||typeof g=="bigint"?String(g):""),l.push({type:typeof g=="string"?0:1,value:g});continue}if(Ct(s)){let u=typeof s.style=="string"?r.date[s.style]:Fe(s.style)?s.style.parsedOptions:void 0;l.push({type:0,value:e.getDateTimeFormat(i,u).format(g)});continue}if(Dt(s)){let u=typeof s.style=="string"?r.time[s.style]:Fe(s.style)?s.style.parsedOptions:r.time.medium;l.push({type:0,value:e.getDateTimeFormat(i,u).format(g)});continue}if(At(s)){let u=typeof s.style=="string"?r.number[s.style]:Ht(s.style)?s.style.parsedOptions:void 0;if(u&&u.scale){let _=u.scale||1;if(typeof g=="bigint"){if(!Number.isInteger(_))throw new TypeError(`Cannot apply fractional scale ${_} to bigint value. Scale must be an integer when formatting bigint.`);g=g*BigInt(_)}else g=g*_}l.push({type:0,value:e.getNumberFormat(i,u).format(g)});continue}if(Rt(s)){let{children:u,value:_}=s,y=a[_];if(!En(y))throw new xn(_,"function",o);let b=y(Me(u,i,e,r,a,n).map(k=>k.value));Array.isArray(b)||(b=[b]),l.push(...b.map(k=>({type:typeof k=="string"?0:1,value:k})))}if(zt(s)){let u=g,_=(Object.prototype.hasOwnProperty.call(s.options,u)?s.options[u]:void 0)||s.options.other;if(!_)throw new Ai(s.value,g,Object.keys(s.options),o);l.push(...Me(_.value,i,e,r,a));continue}if(It(s)){let u=`=${g}`,_=Object.prototype.hasOwnProperty.call(s.options,u)?s.options[u]:void 0;if(!_){if(!Intl.PluralRules)throw new Oe(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,"MISSING_INTL_API",o);let b=typeof g=="bigint"?Number(g):g,k=e.getPluralRules(i,{type:s.pluralType}).select(b-(s.offset||0));_=(Object.prototype.hasOwnProperty.call(s.options,k)?s.options[k]:void 0)||s.options.other}if(!_)throw new Ai(s.value,g,Object.keys(s.options),o);let y=typeof g=="bigint"?Number(g):g;l.push(...Me(_.value,i,e,r,a,y-(s.offset||0)));continue}}return Tn(l)}function $n(t,i){return i?{...t,...i,...Object.keys(t).reduce((e,r)=>(e[r]={...t[r],...i[r]},e),{})}:t}function Sn(t,i){return i?Object.keys(t).reduce((e,r)=>(e[r]=$n(t[r],i[r]),e),{...t}):t}function Lt(t){return{create(){return{get(i){return t[i]},set(i,e){t[i]=e}}}}}function An(t={number:{},dateTime:{},pluralRules:{}}){return{getNumberFormat:Ne((...i)=>new Intl.NumberFormat(...i),{cache:Lt(t.number),strategy:Pe.variadic}),getDateTimeFormat:Ne((...i)=>new Intl.DateTimeFormat(...i),{cache:Lt(t.dateTime),strategy:Pe.variadic}),getPluralRules:Ne((...i)=>new Intl.PluralRules(...i),{cache:Lt(t.pluralRules),strategy:Pe.variadic})}}var z,Cn=(z=class{constructor(i,e=z.defaultLocale,r,a){if(this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=(n=>{let o=this.formatToParts(n);if(o.length===1)return o[0].value;let l=o.reduce((s,m)=>(!s.length||m.type!==0||typeof s[s.length-1]!="string"?s.push(m.value):s[s.length-1]+=m.value,s),[]);return l.length<=1?l[0]||"":l}),this.formatToParts=(n=>Me(this.ast,this.locales,this.formatters,this.formats,n,void 0,this.message)),this.resolvedOptions=()=>({locale:this.resolvedLocale?.toString()||Intl.NumberFormat.supportedLocalesOf(this.locales)[0]}),this.getAst=()=>this.ast,this.locales=e,this.resolvedLocale=z.resolveLocale(e),typeof i=="string"){if(this.message=i,!z.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");let{...n}=a||{};this.ast=z.__parse(i,{...n,locale:this.resolvedLocale})}else this.ast=i;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=Sn(z.formats,r),this.formatters=a&&a.formatters||An(this.formatterCache)}static get defaultLocale(){return z.memoizedDefaultLocale||(z.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),z.memoizedDefaultLocale}},z.memoizedDefaultLocale=null,z.resolveLocale=i=>{if(typeof Intl.Locale>"u")return;let e=Intl.NumberFormat.supportedLocalesOf(i);return e.length>0?new Intl.Locale(e[0]):new Intl.Locale(typeof i=="string"?i:i[0])},z.__parse=Si,z.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},z),Ci=Cn;var F={en:ft,de:_t,es:yt,fr:vt,it:bt,nl:wt,pl:xt,"pt-BR":kt};function Dn(t){let i=t.replace(/['"]+/g,"");if(F[i])return F[i];let e=i.split("-")[0];if(F[e])return F[e];let r=Object.keys(F).find(a=>a.startsWith(e+"-"));return r?F[r]:F.en}function c(t,i,...e){var r;try{r=t.split(".").reduce((n,o)=>n[o],Dn(i))}catch{r=t.split(".").reduce((o,l)=>o[l],F.en)}if(r===void 0&&(r=t.split(".").reduce((n,o)=>n[o],F.en)),!e.length)return r;let a={};for(let n=0;n<e.length;n+=2){let o=e[n];o=o.replace(/^{([^}]+)?}$/,"$1"),a[o]=e[n+1]}try{return new Ci(r,i).format(a)}catch(n){return"Translation "+n}}var Di=async()=>{await customElements.whenDefined("partial-panel-resolver"),await document.createElement("partial-panel-resolver")._getRoutes([{component_name:"config",url_path:"a"}])?.routes?.a?.load?.(),await customElements.whenDefined("ha-panel-config");let e=document.createElement("ha-panel-config");await e?.routerOptions?.routes?.dashboard?.load?.(),await e?.routerOptions?.routes?.general?.load?.(),await e?.routerOptions?.routes?.entities?.load?.(),await e?.routerOptions?.routes?.labels?.load?.(),await customElements.whenDefined("ha-config-dashboard")};var zi;(function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"})(zi||(zi={}));var Ii;(function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"})(Ii||(Ii={}));var Ri=(t,i)=>zn(i).format(t),zn=t=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"numeric",day:"numeric"});var Hi=(t,i,e,r)=>{r=r||{},e=e??{};let a=new Event(i,{bubbles:r.bubbles===void 0?!0:r.bubbles,cancelable:!!r.cancelable,composed:r.composed===void 0?!0:r.composed});return a.detail=e,t.dispatchEvent(a),a};var E=(t,i)=>{Hi(t,"hass-notification",{message:i})};var I=S`
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
`,ce=S`
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
`;var ne=t=>{let[i]=t.split("T"),[e,r,a]=i.split("-").map(Number);return new Date(e,r-1,a)},oe=t=>{let i=t.trigger_type??"time";return i==="time"||i==="date"},Ee=t=>`${t.progress_current??0} / ${t.progress_target??0}`,Ge=(t,i,e)=>{let r=t===1?i.slice(0,-1):i;return`${t} ${c(`intervals.${r}`,e)}`},$e=(t,i)=>{let e=t.trigger_type??"time";return e==="count"?c("intervals.every_uses",i,"{value}",String(t.count_threshold??0)):e==="runtime"?c("intervals.every_runtime",i,"{value}",String(t.runtime_threshold??0)):Ge(t.interval_value,t.interval_type,i)},je=(t,i,e)=>{let r=e?new Date(e):new Date;r.setHours(0,0,0,0);let a=null,n=null;oe(t)&&t.next_due&&(a=ne(t.next_due),n=Math.round((a.getTime()-r.getTime())/(1e3*60*60*24)));let o;t.due?o="overdue":n!==null&&n<=i?o="due_soon":o="upcoming";let l=!1;return t.last_performed&&(l=ne(t.last_performed).getTime()===r.getTime()),{nextDue:a,daysUntilDue:n,status:o,completedToday:l}},Bt=(t,i,e)=>{if(t.due)return 1;let r=l=>Math.min(Math.max(l,0),1);if(!oe(t)){let l=t.progress_target??0;return l>0?r((t.progress_current??0)/l):0}if(!i.nextDue||!t.last_performed)return 0;let a=e?new Date(e):new Date;a.setHours(0,0,0,0);let n=ne(t.last_performed).getTime(),o=i.nextDue.getTime()-n;return o<=0?1:r((a.getTime()-n)/o)},Li=(t,i,e)=>{if(!oe(i))return Ee(i);let r=t.daysUntilDue;return r===null?"":r===0?c("panel.list.due_today",e):r<0?c("panel.list.days_overdue",e,"{count}",Math.abs(r)):c("panel.list.days_left",e,"{count}",r)},Ve=(t,i,e,r)=>{let a=e.trim().toLowerCase();if(!a&&!r.length)return t;let n=new Map;return r.length&&i.forEach(o=>n.set(o.unique_id,o.labels)),t.filter(o=>{if(a&&!`${o.title}
${o.description??""}
${o.group_id??""}`.toLowerCase().includes(a))return!1;if(r.length){let l=n.get(o.id)??[];if(!r.some(s=>l.includes(s)))return!1}return!0})},Se=t=>t.completedToday&&t.status!=="overdue"?"done":t.status,qe=(t,i)=>{let e=new Map;return t.forEach(r=>{let a=Se(r);if(a!=="overdue"&&a!=="due_soon")return;let n=i(r),o=e.get(n);o?(o.count+=1,a==="overdue"&&(o.status="overdue")):e.set(n,{count:1,status:a})}),e},Nt=(t,i,e)=>{let r=new Intl.Collator(e),a=(o,l)=>o.nextDue&&l.nextDue?o.nextDue.getTime()-l.nextDue.getTime():o.nextDue?-1:l.nextDue?1:r.compare(i(o),i(l)),n={overdue:[],dueSoon:[],upcoming:[],done:[]};return t.forEach(o=>{let l=Se(o);l==="overdue"?n.overdue.push(o):l==="due_soon"?n.dueSoon.push(o):l==="done"?n.done.push(o):n.upcoming.push(o)}),n.overdue.sort(a),n.dueSoon.sort(a),n.upcoming.sort(a),n.done.sort(a),n},Bi=(t,i,e,r)=>{let a=new Map;t.forEach(l=>{let s=i(l),m=a.get(s);m?m.push(l):a.set(s,[l])});let n=new Intl.Collator(r);return[...a.keys()].sort((l,s)=>l===""?1:s===""?-1:n.compare(l,s)).map(l=>{let s=Nt(a.get(l),e,r);return{group:l,tasks:[...s.overdue,...s.dueSoon,...s.upcoming,...s.done]}})},Ue=class{constructor(i,e){this._fn=i;this._ms=e}schedule(){this.cancel(),this._timer=setTimeout(()=>{this._timer=void 0,this._fn()},this._ms)}cancel(){this._timer!==void 0&&clearTimeout(this._timer),this._timer=void 0}};var We=["days","weeks","months","years"];var Ni=500;function Pi(t){return{days:c("intervals.days",t),weeks:c("intervals.weeks",t),months:c("intervals.months",t),years:c("intervals.years",t)}}var In=["title","description","interval_value","interval_type","last_performed","icon","group_id"],Fi=t=>{let i=[],e=[],r="",a=!1,n=0,o=()=>{e.push(r),r=""},l=()=>{o(),e.some(s=>s.trim()!=="")&&i.push(e),e=[]};for(;n<t.length;){let s=t[n];if(a){if(s==='"'){if(t[n+1]==='"'){r+='"',n+=2;continue}a=!1,n+=1;continue}r+=s,n+=1;continue}if(s==='"'&&r===""){a=!0,n+=1;continue}if(s===","){o(),n+=1;continue}if(s===`
`||s==="\r"){s==="\r"&&t[n+1]===`
`&&(n+=1),l(),n+=1;continue}r+=s,n+=1}return(r!==""||e.length)&&l(),i},Rn=/^\d{4}-\d{2}-\d{2}$/,Mi=t=>{if(!t.length)return{tasks:[],errors:["The file is empty."]};let i=t[0].map(a=>a.trim().toLowerCase());if(!i.includes("title"))return{tasks:[],errors:['The header row must include a "title" column.']};let e=[],r=[];return t.slice(1).forEach((a,n)=>{let o=n+2,l=b=>{let k=i.indexOf(b);return k>=0?(a[k]??"").trim():""},s=l("title");if(!s){r.push(`Line ${o}: missing title.`);return}let m=l("interval_value"),g=m===""?30:Number(m);if(!Number.isFinite(g)||g<1){r.push(`Line ${o}: invalid interval_value "${m}".`);return}let u=l("interval_type").toLowerCase(),_=u===""?"days":u;if(!We.includes(_)){r.push(`Line ${o}: invalid interval_type "${u}".`);return}let y=l("last_performed");if(y&&!Rn.test(y)){r.push(`Line ${o}: last_performed must be YYYY-MM-DD.`);return}e.push({title:s,description:l("description")||void 0,interval_value:Math.floor(g),interval_type:_,last_performed:y||void 0,icon:l("icon")||void 0,group_id:l("group_id")||void 0})}),{tasks:e,errors:r}},Hn=t=>{let i=/^[=+\-@\t]/.test(t)?`'${t}`:t;return/[",\n\r]/.test(i)?`"${i.replace(/"/g,'""')}"`:i},Oi=t=>{let i=[In.join(",")];return t.forEach(e=>{i.push([e.title,e.description??"",String(e.interval_value),e.interval_type,e.last_performed?e.last_performed.split("T")[0]:"",e.icon??"",e.group_id??""].map(Hn).join(","))}),i.join(`\r
`)+`\r
`};var Ze=t=>Object.keys(t.services?.notify??{}).filter(i=>i!=="notify").map(i=>`notify.${i}`).sort((i,e)=>i.localeCompare(e)),R=t=>customElements.get("ha-dialog-footer")?d`<ha-dialog-footer slot="footer">${t}</ha-dialog-footer>`:t,Xe=(t,i,e,r=a=>Ri(a,e))=>t?.length?d`
        <ul class="history-list">
            ${t.slice(-i).reverse().map(a=>d`
                <li>
                    ${r(ne(a.performed))}${a.note?d` — <span class="history-note">${a.note}</span>`:f}
                </li>
            `)}
        </ul>
    `:f,Ye=S`
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
`;var Ui=t=>t.callWS({type:"config/entity_registry/list"}),Gi=t=>t.callWS({type:"config/label_registry/list"}),ji=t=>t.callWS({type:"tasks/get_tasks"}),Vi=(t,i)=>t.callWS({type:"tasks/get_task",task_id:i}),Je=(t,i)=>t.callWS({type:"tasks/add_task",...i}),qi=(t,i)=>t.callWS({type:"tasks/remove_task",task_id:i}),Wi=(t,i,e)=>t.callWS({type:"tasks/complete_task",task_id:i,...e?{note:e}:{}}),Qe=(t,i)=>t.callWS({type:"tasks/update_task",...i}),Zi=t=>t.callWS({type:"tasks/get_groups"}),Xi=(t,i)=>t.callWS({type:"tasks/create_group",group_id:i}),Yi=(t,i,e)=>t.callWS({type:"tasks/rename_group",old_group_id:i,new_group_id:e}),Ji=(t,i)=>t.callWS({type:"tasks/delete_group",group_id:i}),Qi=t=>t.callWS({type:"tasks/get_config"}),Ki=(t,i)=>t.connection.subscribeMessage(i,{type:"tasks/subscribe_updates"});var er={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},tr=t=>(...i)=>({_$litDirective$:t,values:i}),Ke=class{constructor(i){}get _$AU(){return this._$AM._$AU}_$AT(i,e,r){this._$Ct=i,this._$AM=e,this._$Ci=r}_$AS(i,e){return this.update(i,e)}update(i,e){return this.render(...e)}};var{I:Ln}=ci,ir=t=>t;var rr=()=>document.createComment(""),de=(t,i,e)=>{let r=t._$AA.parentNode,a=i===void 0?t._$AB:i._$AA;if(e===void 0){let n=r.insertBefore(rr(),a),o=r.insertBefore(rr(),a);e=new Ln(n,o,t,t.options)}else{let n=e._$AB.nextSibling,o=e._$AM,l=o!==t;if(l){let s;e._$AQ?.(t),e._$AM=t,e._$AP!==void 0&&(s=t._$AU)!==o._$AU&&e._$AP(s)}if(n!==a||l){let s=e._$AA;for(;s!==n;){let m=ir(s).nextSibling;ir(r).insertBefore(s,a),s=m}}}return e},J=(t,i,e=t)=>(t._$AI(i,e),t),Bn={},ar=(t,i=Bn)=>t._$AH=i,nr=t=>t._$AH,et=t=>{t._$AR(),t._$AA.remove()};var or=(t,i,e)=>{let r=new Map;for(let a=i;a<=e;a++)r.set(t[a],a);return r},Pt=tr(class extends Ke{constructor(t){if(super(t),t.type!==er.CHILD)throw Error("repeat() can only be used in text expressions")}dt(t,i,e){let r;e===void 0?e=i:i!==void 0&&(r=i);let a=[],n=[],o=0;for(let l of t)a[o]=r?r(l,o):o,n[o]=e(l,o),o++;return{values:n,keys:a}}render(t,i,e){return this.dt(t,i,e).values}update(t,[i,e,r]){let a=nr(t),{values:n,keys:o}=this.dt(i,e,r);if(!Array.isArray(a))return this.ut=o,n;let l=this.ut??(this.ut=[]),s=[],m,g,u=0,_=a.length-1,y=0,b=n.length-1;for(;u<=_&&y<=b;)if(a[u]===null)u++;else if(a[_]===null)_--;else if(l[u]===o[y])s[y]=J(a[u],n[y]),u++,y++;else if(l[_]===o[b])s[b]=J(a[_],n[b]),_--,b--;else if(l[u]===o[b])s[b]=J(a[u],n[b]),de(t,s[b+1],a[u]),u++,b--;else if(l[_]===o[y])s[y]=J(a[_],n[y]),de(t,a[u],a[_]),_--,y++;else if(m===void 0&&(m=or(o,y,b),g=or(l,u,_)),m.has(l[u]))if(m.has(l[_])){let k=g.get(o[y]),me=k!==void 0?a[k]:null;if(me===null){let jt=de(t,a[u]);J(jt,n[y]),s[y]=jt}else s[y]=J(me,n[y]),de(t,a[u],me),a[k]=null;y++}else et(a[_]),_--;else et(a[u]),u++;for(;y<=b;){let k=de(t,s[b+1]);J(k,n[y]),s[y++]=k}for(;u<=_;){let k=a[u++];k!==null&&et(k)}return this.ut=o,ar(t,s),P}});var Nn=(t,i)=>{let e=t.language,r=oe(i),a=r?$e(i,e):Ee(i);return{heading:c("panel.dialog.confirm_complete.title",e),message:c(r?"panel.dialog.confirm_complete.message":"panel.dialog.confirm_complete.message_progress",e,"{title}",i.title,"{interval}",a),confirmLabel:c("panel.dialog.confirm_complete.actions.confirm",e),cancelLabel:c("common.cancel",e),input:{label:c("panel.dialog.confirm_complete.note_label",e)},onConfirm:()=>{}}},sr=(t,i,e,r,a=n=>n())=>{let n=e.language;i?.open({...Nn(e,r),onConfirm:o=>a(async()=>{try{await Wi(e,r.id,o),E(t,c("panel.cards.current.alerts.complete_success",n,"{title}",r.title))}catch(l){console.error("Failed to complete task:",l),E(t,c("panel.cards.current.alerts.complete_error",n))}})})},lr=(t,i,e,r,a)=>{let n=e.language;i?.open({heading:c("panel.dialog.confirm_remove.title",n),message:c("panel.dialog.confirm_remove.message",n,"{title}",r?.title??""),confirmLabel:c("panel.dialog.confirm_remove.actions.confirm",n),cancelLabel:c("common.cancel",n),destructive:!0,onConfirm:async()=>{try{await qi(e,a)}catch(o){console.error("Failed to remove task:",o),E(t,c("panel.cards.current.alerts.remove_error",n))}}})};var ue=class extends T{constructor(){super(...arguments);this._opts=null}open(e){this._opts=e}_close(){this._opts=null}_handleConfirm(){let e=this._opts?.onConfirm,r=this._input?.value.trim()||void 0;this._close(),e?.(r)}_renderButtons(){return d`
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
                            maxlength=${Ni}
                            placeholder=${this._opts.input.placeholder??""}
                        />
                    </label>
                `:f}

                ${R(this._renderButtons())}
            </ha-dialog>
        `:d``}};ue.styles=[I,S`
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
    `],p([v()],ue.prototype,"_opts",2),p([D(".confirm-input")],ue.prototype,"_input",2);customElements.get("hm-confirm-dialog")||customElements.define("hm-confirm-dialog",ue);var Pn=3,Ft=[{bucket:"overdue",key:"overdue",label:"panel.list.overdue",icon:"mdi:alert-circle-outline"},{bucket:"due_soon",key:"dueSoon",label:"panel.list.due_soon",icon:"mdi:clock-alert-outline"},{bucket:"upcoming",key:"upcoming",label:"panel.list.upcoming",icon:"mdi:calendar-check-outline"},{bucket:"done",key:"done",label:"panel.list.done_today",icon:"mdi:check-circle-outline"}],cr={time:"mdi:calendar-refresh",date:"mdi:calendar-star",count:"mdi:counter",runtime:"mdi:timer-cog-outline"},Ot=17,dr=2*Math.PI*Ot,Mt=t=>t.raw.group_id?.trim()||"",ur=t=>t.raw.title,Fn=t=>t&&/^[a-z-]+$/.test(t)?`var(--${t}-color)`:t,$=class extends T{constructor(){super(...arguments);this.tasks=[];this.groups=[];this.heading="";this.dueSoonDays=14;this.searchMode="toggle";this.showGroupChips=!0;this.groupFilter=null;this.groupBy="status";this.readonly=!1;this._completing=new Set;this._expandedTasks=new Set;this._collapsed=new Set;this._searchQuery="";this._searchOpen=!1;this._statusFilter="";this._formatDate=e=>{let r=this.hass?.locale?.language??this.hass?.language??"en";if(this._dateFormats?.lang!==r){let n=r;try{new Intl.DateTimeFormat(n)}catch{n=void 0}this._dateFormats={lang:r,short:new Intl.DateTimeFormat(n,{month:"short",day:"numeric"}),withYear:new Intl.DateTimeFormat(n,{month:"short",day:"numeric",year:"numeric"})}}return(e.getFullYear()===new Date().getFullYear()?this._dateFormats.short:this._dateFormats.withYear).format(e)}}get _hasUngrouped(){return this.tasks.some(e=>!e.group_id?.trim())}get _activeGroup(){let e=this.groupFilter;return e===null?null:e===""?this._hasUngrouped?"":null:this.groups.includes(e)?e:null}get _view(){let e=this.hass?.language??"en",r=[this.tasks,this.groups,this._searchQuery,this.groupFilter,this._statusFilter,this.dueSoonDays,this.groupBy,e],a=this._viewCache;if(a&&a.deps.every((y,b)=>y===r[b]))return a.view;let n=Ve(this.tasks,[],this._searchQuery,[]).map(y=>({raw:y,...je(y,this.dueSoonDays)})),o=qe(n,Mt),l=this._activeGroup,s=l===null?n:n.filter(y=>Mt(y)===l),m=Nt(s,ur,e),g={overdue:m.overdue.length,due_soon:m.dueSoon.length,upcoming:m.upcoming.length,done:m.done.length},u;if(this.groupBy==="group"){let y=this._statusFilter?s.filter(b=>Se(b)===this._statusFilter):s;u=Bi(y,Mt,ur,e).map(({group:b,tasks:k})=>({key:`group:${b}`,tone:"group",label:b||c("common.ungrouped",e),tasks:k,attention:o.get(b)}))}else{let y=m;if(this._statusFilter){let b=Ft.find(k=>k.bucket===this._statusFilter).key;y={overdue:[],dueSoon:[],upcoming:[],done:[],[b]:m[b]}}u=Ft.map(({bucket:b,key:k,label:me})=>({key:`status:${b}`,tone:b,label:c(me,e),tasks:y[k]})).filter(b=>b.tasks.length>0)}let _={counts:g,sections:u,groupAttention:o};return this._viewCache={deps:r,view:_},_}_fire(e,r){this.dispatchEvent(new CustomEvent(e,{detail:r,bubbles:!0,composed:!0}))}_completeTask(e){this._completing.has(e.id)||sr(this,this._confirmDialog,this.hass,e,async r=>{this._completing=new Set(this._completing).add(e.id);try{await r()}finally{let a=new Set(this._completing);a.delete(e.id),this._completing=a}})}_removeTask(e){let r=this.tasks.find(a=>a.id===e);lr(this,this._confirmDialog,this.hass,r,e)}_toggleExpand(e){let r=new Set(this._expandedTasks);r.has(e)?r.delete(e):r.add(e),this._expandedTasks=r}_toggleSection(e){let r=new Set(this._collapsed);r.has(e)?r.delete(e):r.add(e),this._collapsed=r}_toggleStatusFilter(e){this._statusFilter=this._statusFilter===e?"":e;let r=`status:${e}`;if(this._collapsed.has(r)){let a=new Set(this._collapsed);a.delete(r),this._collapsed=a}}_setGroupFilter(e){this.groupFilter=e,this._fire("group-filter-changed",{group:e})}_setGroupBy(e){this.groupBy!==e&&(this.groupBy=e,this._fire("group-by-changed",{groupBy:e}))}async _toggleSearch(){if(this._searchOpen){this._searchOpen=!1,this._searchQuery="";return}this._searchOpen=!0,await this.updateComplete,this._searchInput?.focus()}_onSearchKeydown(e){e.key==="Escape"&&(this._searchQuery="",this.searchMode==="toggle"&&(this._searchOpen=!1))}render(){if(!this.hass)return d``;let e=this.hass.language,r=this._view,a=this.searchMode==="toggle"&&(this._searchOpen||!!this._searchQuery),n=this.showGroupChips&&this.groups.length>0,o=r.sections.reduce((l,s)=>l+s.tasks.length,0);return d`
            ${this._renderHeader(r.counts,a)}
            ${a?d`<div class="search-row">${this._renderSearchField()}</div>`:f}
            ${this._renderSummary(r.counts)}
            ${n?this._renderGroupChips(r):f}
            ${this._renderToolbar()}

            <div class="task-list">
                ${Pt(r.sections,l=>l.key,l=>this._renderSection(l))}

                ${o===0?d`
                    <div class="empty">
                        <ha-icon icon="mdi:clipboard-check-outline"></ha-icon>
                        <span>${c("panel.list.no_tasks",e)}</span>
                    </div>
                `:f}
            </div>

            <hm-confirm-dialog></hm-confirm-dialog>
        `}_renderHeader(e,r){let a=this.hass.language,n=e.overdue+e.due_soon,o=e.overdue?"overdue":e.due_soon?"due_soon":"done";return d`
            <div class="header">
                <div class="header-icon ${o}">
                    <ha-icon icon=${n?"mdi:clipboard-text-clock-outline":"mdi:check-decagram-outline"}></ha-icon>
                </div>
                <div class="header-text">
                    <div class="title">${this.heading}</div>
                    <div class="subtitle ${o}">
                        ${n?c("panel.list.needs_attention",a,"{count}",n):c("panel.list.all_caught_up",a)}
                    </div>
                </div>
                ${this.searchMode==="header"?d`
                    <div class="header-search">${this._renderSearchField()}</div>
                `:d`
                    <button
                        class="icon-button ${r?"active":""}"
                        @click=${this._toggleSearch}
                        title=${c("panel.list.search",a)}
                        aria-label=${c("panel.list.search",a)}
                        aria-pressed=${r?"true":"false"}
                    >
                        <ha-icon icon="mdi:magnify"></ha-icon>
                    </button>
                `}
            </div>
        `}_renderSearchField(){let e=this.hass.language;return d`
            <div class="search">
                <ha-icon icon="mdi:magnify"></ha-icon>
                <input
                    type="search"
                    .value=${this._searchQuery}
                    @input=${r=>this._searchQuery=r.target.value}
                    @keydown=${this._onSearchKeydown}
                    placeholder=${c("panel.list.search",e)}
                    aria-label=${c("panel.list.search",e)}
                />
                ${this._searchQuery?d`
                    <button
                        class="icon-button small"
                        @click=${()=>{this._searchQuery="",this._searchInput?.focus()}}
                        title=${c("panel.list.clear_search",e)}
                        aria-label=${c("panel.list.clear_search",e)}
                    >
                        <ha-icon icon="mdi:close"></ha-icon>
                    </button>
                `:f}
            </div>
        `}_renderSummary(e){let r=this.hass.language;return d`
            <div class="summary ${this._statusFilter?"filtering":""}">
                ${Ft.slice(0,3).map(({bucket:a,label:n,icon:o})=>{let l=e[a],s=this._statusFilter===a;return d`
                        <button
                            class="tile ${a} ${l===0?"zero":""} ${s?"active":""}"
                            aria-pressed=${s?"true":"false"}
                            @click=${()=>this._toggleStatusFilter(a)}
                        >
                            <ha-icon icon=${o}></ha-icon>
                            <span class="tile-count">${l}</span>
                            <span class="tile-label">${c(n,r)}</span>
                        </button>
                    `})}
            </div>
        `}_renderGroupChips(e){let r=this.hass.language,a=this._activeGroup,n=(o,l)=>{let s=a===o,m=o===null?void 0:e.groupAttention.get(o);return d`
                <button
                    class="chip ${s?"selected":""}"
                    aria-pressed=${s?"true":"false"}
                    @click=${()=>this._setGroupFilter(s?null:o)}
                >
                    ${l}
                    ${m?d`
                        <span class="chip-badge ${m.status}">${m.count}</span>
                    `:f}
                </button>
            `};return d`
            <div class="chips" role="group">
                ${n(null,c("panel.list.all_groups",r))}
                ${this.groups.map(o=>n(o,o))}
                ${this._hasUngrouped?n("",c("common.ungrouped",r)):f}
            </div>
        `}_renderToolbar(){let e=this.hass.language,r=(a,n)=>d`
            <button
                class=${this.groupBy===a?"selected":""}
                aria-pressed=${this.groupBy===a?"true":"false"}
                @click=${()=>this._setGroupBy(a)}
            >${n}</button>
        `;return d`
            <div class="list-toolbar">
                <slot name="filters"></slot>
                <div class="segmented" role="group" aria-label=${c("panel.list.group_by",e)}>
                    <span class="segmented-label">${c("panel.list.group_by",e)}</span>
                    ${r("status",c("panel.list.by_status",e))}
                    ${r("group",c("panel.dialog.move_task.fields.group_id.heading",e))}
                </div>
            </div>
        `}_renderSection(e){let r=this._collapsed.has(e.key);return d`
            <section class="section ${e.tone}">
                <button
                    class="section-header"
                    aria-expanded=${r?"false":"true"}
                    @click=${()=>this._toggleSection(e.key)}
                >
                    <span class="section-title">${e.label}</span>
                    <span class="section-count">${e.tasks.length}</span>
                    ${e.attention?d`
                        <span class="chip-badge ${e.attention.status}">${e.attention.count}</span>
                    `:f}
                    <span class="section-rule"></span>
                    <ha-icon class="chevron ${r?"collapsed":""}" icon="mdi:chevron-down"></ha-icon>
                </button>
                ${r?f:d`
                    <div class="rows">
                        ${Pt(e.tasks,a=>a.raw.id,a=>this._renderRow(a))}
                    </div>
                `}
            </section>
        `}_renderRow(e){let r=e.raw,a=this.hass.language,n=Se(e),o=n==="done",l=this._expandedTasks.has(r.id),s=this._completing.has(r.id),m=!!r.group_id&&this._activeGroup===null&&this.groupBy!=="group",g=o?c("panel.list.done",a):Li(e,r,a),u;return o&&e.nextDue?u=c("panel.list.next_due",a,"{date}",this._formatDate(e.nextDue)):!o&&e.nextDue&&(u=this._formatDate(e.nextDue)),d`
            <div class="row ${n} ${l?"expanded":""} ${s?"completing":""}">
                <button
                    class="row-main"
                    aria-expanded=${l?"true":"false"}
                    @click=${()=>this._toggleExpand(r.id)}
                >
                    ${this._renderRing(e,n)}
                    <span class="row-text">
                        <span class="row-title">${r.title}</span>
                        <span class="row-meta">
                            <!-- Narrow layouts show the due pill here instead of in .row-due. -->
                            <span class="pill meta-due">${g}</span>
                            ${m?d`
                                <span class="meta-item meta-group">
                                    <ha-icon icon="mdi:folder-outline"></ha-icon>
                                    <span class="meta-text">${r.group_id}</span>
                                </span>
                            `:f}
                            <span class="meta-item meta-interval">
                                <ha-icon icon="mdi:repeat"></ha-icon>${$e(r,a)}
                            </span>
                        </span>
                    </span>
                    <span class="row-due">
                        <span class="pill">${g}</span>
                        ${u?d`<span class="due-date">${u}</span>`:f}
                    </span>
                </button>
                <button
                    class="check"
                    @click=${()=>this._completeTask(r)}
                    ?disabled=${s||o}
                    title=${c(o?"panel.list.done":"panel.list.complete",a)}
                    aria-label=${`${c(o?"panel.list.done":"panel.list.complete",a)}: ${r.title}`}
                >
                    <ha-icon icon="mdi:check-bold"></ha-icon>
                </button>
                ${l?this._renderDetails(e):f}
            </div>
        `}_renderRing(e,r){let a=r==="done"?1:Bt(e.raw,e),n=e.raw.icon||cr[e.raw.trigger_type??"time"]||cr.time;return d`
            <span class="ring">
                <svg viewBox="0 0 40 40" aria-hidden="true">
                    <circle class="ring-track" cx="20" cy="20" r=${Ot}></circle>
                    ${a>.02?oi`
                        <circle
                            class="ring-arc"
                            cx="20" cy="20" r=${Ot}
                            stroke-dasharray=${dr}
                            stroke-dashoffset=${dr*(1-a)}
                        ></circle>
                    `:f}
                </svg>
                <ha-icon .icon=${n}></ha-icon>
            </span>
        `}_renderDetails(e){let r=e.raw,a=this.hass.language,n=oe(r),o=Bt(r,e),l=r.area_id?this.hass.areas?.[r.area_id]?.name:void 0,s=this.labelsByTask?.get(r.id)??[];return d`
            <div class="details">
                ${r.description?d`<p class="description">${r.description}</p>`:f}

                <div class="facts">
                    <div class="fact">
                        <span class="fact-label">${c("panel.list.last_performed",a)}</span>
                        <span class="fact-value">
                            ${r.last_performed?this._formatDate(ne(r.last_performed)):"\u2014"}
                        </span>
                    </div>
                    ${n?d`
                        <div class="fact">
                            <span class="fact-label">${c("panel.cards.current.next",a)}</span>
                            <span class="fact-value">${e.nextDue?this._formatDate(e.nextDue):"\u2014"}</span>
                        </div>
                    `:d`
                        <div class="fact">
                            <span class="fact-label">${c("panel.list.progress",a)}</span>
                            <span class="fact-value">${Ee(r)}</span>
                            <span class="bar"><span style="width: ${Math.round(o*100)}%"></span></span>
                        </div>
                    `}
                    <div class="fact">
                        <span class="fact-label">${c("panel.list.repeats",a)}</span>
                        <span class="fact-value">${$e(r,a)}</span>
                    </div>
                    ${l?d`
                        <div class="fact">
                            <span class="fact-label">${c("panel.cards.new.fields.area.heading",a)}</span>
                            <span class="fact-value">${l}</span>
                        </div>
                    `:f}
                    ${s.length?d`
                        <div class="fact">
                            <span class="fact-label">${c("panel.cards.new.fields.label.heading",a)}</span>
                            <span class="fact-value fact-labels">
                                ${s.map(m=>d`
                                    <span class="label-chip" style=${`--label-color: ${Fn(m.color)??"var(--primary-color)"}`}>
                                        ${m.icon?d`<ha-icon .icon=${m.icon}></ha-icon>`:f}${m.name}
                                    </span>
                                `)}
                            </span>
                        </div>
                    `:f}
                </div>

                ${r.history?.length?d`
                    <div class="history">
                        <span class="fact-label">${c("panel.list.history",a)}</span>
                        ${Xe(r.history,Pn,this.hass.locale,this._formatDate)}
                    </div>
                `:f}

                ${this.readonly?f:d`
                    <div class="details-actions">
                        <button class="action-button" @click=${()=>this._fire("task-edit",{taskId:r.id})}>
                            <ha-icon icon="mdi:pencil-outline"></ha-icon>
                            ${c("panel.cards.current.actions.edit",a)}
                        </button>
                        <button class="action-button" @click=${()=>this._fire("task-move",{taskId:r.id})}>
                            <ha-icon icon="mdi:folder-move-outline"></ha-icon>
                            ${c("panel.cards.current.actions.move",a)}
                        </button>
                        <button class="action-button danger" @click=${()=>this._removeTask(r.id)}>
                            <ha-icon icon="mdi:delete-outline"></ha-icon>
                            ${c("panel.list.remove",a)}
                        </button>
                    </div>
                `}
            </div>
        `}};$.styles=[ce,Ye,S`
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
    `],p([w({attribute:!1})],$.prototype,"hass",2),p([w({attribute:!1})],$.prototype,"tasks",2),p([w({attribute:!1})],$.prototype,"groups",2),p([w()],$.prototype,"heading",2),p([w({type:Number})],$.prototype,"dueSoonDays",2),p([w()],$.prototype,"searchMode",2),p([w({type:Boolean})],$.prototype,"showGroupChips",2),p([w({attribute:!1})],$.prototype,"groupFilter",2),p([w()],$.prototype,"groupBy",2),p([w({attribute:!1})],$.prototype,"labelsByTask",2),p([w({type:Boolean})],$.prototype,"readonly",2),p([v()],$.prototype,"_completing",2),p([v()],$.prototype,"_expandedTasks",2),p([v()],$.prototype,"_collapsed",2),p([v()],$.prototype,"_searchQuery",2),p([v()],$.prototype,"_searchOpen",2),p([v()],$.prototype,"_statusFilter",2),p([D("hm-confirm-dialog")],$.prototype,"_confirmDialog",2),p([D(".search input")],$.prototype,"_searchInput",2);customElements.get("hm-task-list")||customElements.define("hm-task-list",$);var C=class extends T{constructor(){super(...arguments);this.groups=[];this.tasks=[];this.dueSoonDays=14;this.selected=null;this.manageOnly=!1;this.readonly=!1;this._editing=!1;this._creating=!1;this._newName="";this._renaming=null;this._renameValue=""}get _isEditing(){return this.manageOnly||this._editing}get _stats(){let e=this._statsCache;if(e&&e.tasks===this.tasks&&e.dueSoonDays===this.dueSoonDays)return e.stats;let r=s=>s.group_id?.trim()||"",a=new Map;this.tasks.forEach(s=>a.set(r(s),(a.get(r(s))??0)+1));let n=this.tasks.map(s=>({task:s,...je(s,this.dueSoonDays)})),o=qe(n,s=>r(s.task)),l={total:a,attention:o};return this._statsCache={tasks:this.tasks,dueSoonDays:this.dueSoonDays,stats:l},l}_select(e){this.dispatchEvent(new CustomEvent("group-selected",{detail:{group:e},bubbles:!0,composed:!0}))}async _focusInput(){await this.updateComplete,this._input?.focus(),this._input?.select()}_startCreate(){this._creating=!0,this._newName="",this._focusInput()}async _commitCreate(){let e=this._newName.trim();if(!e){this._creating=!1;return}if(this.groups.includes(e)){E(this,c("panel.cards.groups.alerts.exists",this.hass.language,"{title}",e));return}try{await Xi(this.hass,e),this._newName="",this._creating=this.manageOnly}catch(r){console.error("Failed to create group:",r),E(this,c("panel.cards.groups.alerts.error",this.hass.language))}}_startRename(e){this._renaming=e,this._renameValue=e,this._focusInput()}async _commitRename(){let e=this._renaming,r=this._renameValue.trim();if(!e||!r||e===r){this._renaming=null;return}if(this.groups.includes(r)){E(this,c("panel.cards.groups.alerts.exists",this.hass.language,"{title}",r));return}this._renaming=null;try{await Yi(this.hass,e,r),this.selected===e&&this._select(r)}catch(a){console.error("Failed to rename group:",a),E(this,c("panel.cards.groups.alerts.rename_error",this.hass.language))}}_confirmDelete(e){let r=this.hass.language;this._confirmDialog?.open({heading:c("panel.cards.groups.confirm_delete_title",r),message:c("panel.cards.groups.confirm_delete",r,"{title}",e),confirmLabel:c("panel.cards.groups.actions.delete",r),cancelLabel:c("common.cancel",r),destructive:!0,onConfirm:async()=>{try{await Ji(this.hass,e),this.selected===e&&this._select(null)}catch(a){console.error("Failed to delete group:",a),E(this,c("panel.cards.groups.alerts.delete_error",this.hass.language))}}})}_onInputKeydown(e,r,a){e.key==="Enter"?r():e.key==="Escape"&&(e.stopPropagation(),a())}render(){if(!this.hass)return d``;let e=this.hass.language,{total:r}=this._stats,a=r.get("")??0,n=this._isEditing;return d`
            ${this.manageOnly?f:this._renderItem(null,c("panel.nav.all_tasks",e),"mdi:format-list-checks",this.tasks.length)}

            ${this.readonly&&!this.groups.length?f:d`
                <div class="nav-heading">
                    <span>${c("panel.cards.groups.title",e)}</span>
                    <span class="spacer"></span>
                    ${this.readonly?f:d`
                        <button
                            class="icon-button small"
                            @click=${this._startCreate}
                            title=${c("panel.cards.groups.fields.new_group.heading",e)}
                            aria-label=${c("panel.cards.groups.fields.new_group.heading",e)}
                        >
                            <ha-icon icon="mdi:plus"></ha-icon>
                        </button>
                    `}
                    ${this.readonly||this.manageOnly||!this.groups.length?f:d`
                        <button class="text-button" @click=${()=>{this._editing=!this._editing,this._renaming=null}}>
                            ${c(n?"panel.nav.done_editing":"panel.cards.current.actions.edit",e)}
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
                        placeholder=${c("panel.cards.groups.fields.new_group.heading",e)}
                        aria-label=${c("panel.cards.groups.fields.new_group.heading",e)}
                        @input=${o=>this._newName=o.target.value}
                        @keydown=${o=>this._onInputKeydown(o,()=>this._commitCreate(),()=>{this._creating=!1})}
                        @blur=${()=>{!this._newName.trim()&&!this.manageOnly&&(this._creating=!1)}}
                    />
                    <button
                        class="icon-button small"
                        @click=${this._commitCreate}
                        title=${c("panel.cards.groups.actions.create",e)}
                        aria-label=${c("panel.cards.groups.actions.create",e)}
                    >
                        <ha-icon icon="mdi:check"></ha-icon>
                    </button>
                </div>
            `:f}

            ${!this.groups.length&&!this._creating&&!this.manageOnly&&!this.readonly?d`
                <p class="empty">${c("panel.cards.groups.empty",e)}</p>
            `:f}

            ${!this.manageOnly&&a&&this.groups.length?this._renderItem("",c("common.ungrouped",e),"mdi:folder-hidden",a):f}

            <hm-confirm-dialog></hm-confirm-dialog>
        `}_renderItem(e,r,a,n){let o=this.selected===e,l=e===null?this._totalAttention():this._stats.attention.get(e);return d`
            <button
                class="nav-item ${o?"selected":""}"
                aria-current=${o?"true":"false"}
                ?disabled=${this._isEditing}
                @click=${()=>this._select(e)}
            >
                <ha-icon .icon=${o&&a==="mdi:folder-outline"?"mdi:folder":a}></ha-icon>
                <span class="nav-label">${r}</span>
                ${l?d`<span class="chip-badge ${l.status}">${l.count}</span>`:f}
                <span class="nav-count">${n}</span>
            </button>
        `}_renderEditableItem(e){let r=this.hass.language;return d`
            <div class="nav-item editing">
                <ha-icon icon="mdi:folder-outline"></ha-icon>
                ${this._renaming===e?d`
                    <input
                        class="nav-input"
                        .value=${this._renameValue}
                        aria-label=${c("panel.cards.groups.actions.rename",r)}
                        @input=${a=>this._renameValue=a.target.value}
                        @keydown=${a=>this._onInputKeydown(a,()=>this._commitRename(),()=>{this._renaming=null})}
                    />
                    <button
                        class="icon-button small"
                        @click=${this._commitRename}
                        title=${c("panel.cards.groups.actions.save",r)}
                        aria-label=${c("panel.cards.groups.actions.save",r)}
                    >
                        <ha-icon icon="mdi:check"></ha-icon>
                    </button>
                `:d`
                    <span class="nav-label">${e}</span>
                    <button
                        class="icon-button small"
                        @click=${()=>this._startRename(e)}
                        title=${c("panel.cards.groups.actions.rename",r)}
                        aria-label=${`${c("panel.cards.groups.actions.rename",r)}: ${e}`}
                    >
                        <ha-icon icon="mdi:pencil-outline"></ha-icon>
                    </button>
                    <button
                        class="icon-button small danger"
                        @click=${()=>this._confirmDelete(e)}
                        title=${c("panel.cards.groups.actions.delete",r)}
                        aria-label=${`${c("panel.cards.groups.actions.delete",r)}: ${e}`}
                    >
                        <ha-icon icon="mdi:delete-outline"></ha-icon>
                    </button>
                `}
            </div>
        `}_totalAttention(){let e=0,r="due_soon";return this._stats.attention.forEach(a=>{e+=a.count,a.status==="overdue"&&(r="overdue")}),e?{count:e,status:r}:void 0}};C.styles=[ce,S`
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
    `],p([w({attribute:!1})],C.prototype,"hass",2),p([w({attribute:!1})],C.prototype,"groups",2),p([w({attribute:!1})],C.prototype,"tasks",2),p([w({type:Number})],C.prototype,"dueSoonDays",2),p([w({attribute:!1})],C.prototype,"selected",2),p([w({type:Boolean})],C.prototype,"manageOnly",2),p([w({type:Boolean})],C.prototype,"readonly",2),p([v()],C.prototype,"_editing",2),p([v()],C.prototype,"_creating",2),p([v()],C.prototype,"_newName",2),p([v()],C.prototype,"_renaming",2),p([v()],C.prototype,"_renameValue",2),p([D("hm-confirm-dialog")],C.prototype,"_confirmDialog",2),p([D(".nav-input")],C.prototype,"_input",2);customElements.get("hm-group-nav")||customElements.define("hm-group-nav",C);var hr=(t,i,e,r)=>{try{return c(`${t.keyPrefix}.${i}.${e}`,t.hass.language)??r}catch{return r}},tt=(t,i)=>d`
    <div class="field ${i.name}">
        <div class="field-label">
            ${hr(t,i.name,"heading",i.name)}${i.required?" *":""}
        </div>
        <ha-selector
            .hass=${t.hass}
            .selector=${i.selector}
            .value=${t.data[i.name]}
            .helper=${hr(t,i.name,"helper","")}
            .required=${i.required??!1}
            @value-changed=${e=>t.onChange(i.name,e)}
        ></ha-selector>
    </div>
`,it=S`
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
`;var he=()=>({title:"",trigger_type:"time",interval_value:"",interval_type:"days",last_performed:"",anchor_date:"",active_months:[],icon:"",label:[],tag:"",count_entity_id:"",count_threshold:"",runtime_entity_id:"",runtime_threshold:"",area:"",description:"",group_id:"",notifications_enabled:!1,notification_target:"",notification_time:"09:00",notification_url:"",notify_when:"due_and_overdue",notify_days_before_due:""}),mr=(t,i,e)=>({title:t.title,trigger_type:t.trigger_type??"time",interval_value:t.interval_value,interval_type:t.interval_type,last_performed:t.last_performed??"",anchor_date:t.anchor_date??"",active_months:(t.active_months??[]).map(String),icon:t.icon??"",label:e.map(r=>r.label_id),tag:t.tag_id??"",count_entity_id:t.count_entity_id??"",count_threshold:t.count_threshold??"",runtime_entity_id:t.runtime_entity_id??"",runtime_threshold:t.runtime_threshold??"",area:i?.area_id??"",description:t.description??"",group_id:t.group_id??"",notifications_enabled:t.notifications_enabled??!1,notification_target:t.notification_target??"",notification_time:t.notification_time??"09:00",notification_url:t.notification_url??"",notify_when:t.notify_when??"due_and_overdue",notify_days_before_due:t.notify_days_before_due??""}),Mn=t=>({name:"trigger_type",required:!0,selector:{select:{options:[{value:"time",label:c("trigger_types.time",t)},{value:"date",label:c("trigger_types.date",t)},{value:"count",label:c("trigger_types.count",t)},{value:"runtime",label:c("trigger_types.runtime",t)}],mode:"dropdown"}}}),On=t=>{let i;try{i=new Intl.DateTimeFormat(t,{month:"long"})}catch{i=new Intl.DateTimeFormat("en",{month:"long"})}return Array.from({length:12},(e,r)=>({value:String(r+1),label:i.format(new Date(2026,r,1,12))}))},Un=t=>({name:"active_months",selector:{select:{options:On(t),multiple:!0,mode:"dropdown"}}}),pr=t=>({name:"interval_type",required:!0,selector:{select:{options:We.map(i=>({value:i,label:Pi(t)[i]})),mode:"dropdown"}}}),Gn=(t,i)=>t.trigger_type==="date"?[{name:"anchor_date",required:!0,selector:{date:{}}},{name:"interval_value",required:!0,selector:{number:{min:1,mode:"box"}}},pr(i)]:t.trigger_type==="count"?[{name:"count_entity_id",required:!0,selector:{entity:{}}},{name:"count_threshold",required:!0,selector:{number:{min:1,mode:"box"}}}]:t.trigger_type==="runtime"?[{name:"runtime_entity_id",required:!0,selector:{entity:{filter:{domain:"sensor"}}}},{name:"runtime_threshold",required:!0,selector:{number:{min:.1,step:.1,mode:"box"}}}]:[{name:"interval_value",required:!0,selector:{number:{min:1,mode:"box"}}},pr(i),Un(i)],Ut=(t,i)=>({name:"group_id",selector:{select:{options:[{value:"",label:c("common.ungrouped",i)},...t.map(e=>({value:e,label:e}))],mode:"dropdown",custom_value:!0}}}),rt=(t,i)=>[{name:"title",required:!0,selector:{text:{}}},Mn(i),...Gn(t,i)],at={name:"last_performed",selector:{date:{}}},nt=(t,i)=>[Ut(t,i),{name:"icon",selector:{icon:{}}},{name:"tag",selector:{entity:{filter:{domain:"tag"}}}},{name:"area",selector:{area:{}}},{name:"label",selector:{label:{multiple:!0}}}],ot=t=>({name:"description",selector:{text:t?{multiline:!0}:{}}}),st=(t,i,e)=>{let r={name:"notifications_enabled",selector:{boolean:{}}};return t.notifications_enabled?[r,{name:"notification_target",selector:{select:{options:[{value:"",label:c("common.none",e)},...i.map(a=>({value:a,label:a}))],mode:"dropdown",custom_value:!0}}},{name:"notify_when",selector:{select:{options:[{value:"due",label:c("notifications.when.due",e)},{value:"overdue",label:c("notifications.when.overdue",e)},{value:"due_and_overdue",label:c("notifications.when.due_and_overdue",e)}],mode:"dropdown"}}},...t.trigger_type==="time"||t.trigger_type==="date"?[{name:"notify_days_before_due",selector:{number:{min:1,mode:"box"}}}]:[],{name:"notification_time",selector:{time:{no_second:!0}}},{name:"notification_url",selector:{text:{}}}]:[r]},lt=t=>t.title?.trim()?t.trigger_type==="count"?!!(t.count_entity_id?.trim()&&t.count_threshold):t.trigger_type==="runtime"?!!(t.runtime_entity_id?.trim()&&t.runtime_threshold):t.trigger_type==="date"?!!(t.anchor_date?.trim()&&t.interval_value&&t.interval_type):!!(t.interval_value&&t.interval_type):!1,pe=t=>{if(!t){let s=new Date;return s.setHours(0,0,0,0),s.toISOString()}let[i,e,r]=t.split("T")[0].split("-"),a=Number(i),n=Number(e),o=Number(r);if(isNaN(a)||isNaN(n)||isNaN(o))return null;let l=new Date(a,n-1,o);return l.setHours(0,0,0,0),l.toISOString()},gr=t=>({notifications_enabled:t.notifications_enabled??!1,notification_target:t.notification_target?.trim()||null,notification_time:t.notification_time?.trim()||"09:00",notification_url:t.notification_url?.trim()||null,notify_when:t.notify_when||"due_and_overdue",notify_days_before_due:t.notify_days_before_due===""||t.notify_days_before_due==null?null:Number(t.notify_days_before_due)}),fr=t=>{let i=t.trigger_type==="count",e=t.trigger_type==="runtime",r=t.trigger_type==="date",a=!i&&!e&&!r;return{trigger_type:t.trigger_type||"time",interval_value:i||e?1:Number(t.interval_value),interval_type:i||e?"days":t.interval_type,anchor_date:r&&t.anchor_date?.trim().split("T")[0]||null,active_months:a?(t.active_months??[]).map(Number):[],count_entity_id:i&&t.count_entity_id?.trim()||null,count_threshold:i?Number(t.count_threshold):0,runtime_entity_id:e&&t.runtime_entity_id?.trim()||null,runtime_threshold:e?Number(t.runtime_threshold):0}},_r=(t,i)=>{let e=fr(t),r=t.trigger_type==="date"&&!t.last_performed?.trim();return{title:t.title.trim(),interval_value:e.interval_value,interval_type:e.interval_type,trigger_type:e.trigger_type,...r?{}:{last_performed:i},tag_id:t.tag?.trim()||void 0,icon:t.icon?.trim()||"mdi:calendar-check",labels:t.label??[],area_id:t.area?.trim()||void 0,description:t.description||void 0,group_id:t.group_id?.trim()||void 0,...e.anchor_date?{anchor_date:e.anchor_date}:{},...e.active_months.length?{active_months:e.active_months}:{},...e.count_entity_id?{count_entity_id:e.count_entity_id,count_threshold:e.count_threshold}:{},...e.runtime_entity_id?{runtime_entity_id:e.runtime_entity_id,runtime_threshold:e.runtime_threshold}:{},...gr(t)}},yr=(t,i)=>({title:t.title.trim(),...fr(t),last_performed:i,icon:t.icon?.trim()||"mdi:calendar-check",labels:t.label,tag_id:t.tag?.trim()||null,area_id:t.area?.trim()||null,description:t.description??"",group_id:t.group_id?.trim()||null,...gr(t)});var se=class extends T{constructor(){super(...arguments);this.groups=[];this._formData=he();this._advancedOpen=!1;this._handleFieldChanged=(e,r)=>{r.stopPropagation(),this._formData={...this._formData,[e]:r.detail.value}};this._renderField=e=>tt({hass:this.hass,keyPrefix:"panel.cards.new.fields",data:this._formData,onChange:this._handleFieldChanged},e)}prefill(e){this._formData={...this._formData,...e}}async submit(){if(!lt(this._formData)){E(this,c("panel.cards.new.alerts.required",this.hass.language));return}let e=pe(this._formData.last_performed);if(e===null){E(this,c("common.invalid_date",this.hass.language));return}try{let r=this._formData.title.trim();await Je(this.hass,_r(this._formData,e)),this._formData=he(),this.dispatchEvent(new CustomEvent("task-added",{detail:{title:r},bubbles:!0,composed:!0}))}catch(r){console.error("Failed to add task:",r),E(this,c("panel.cards.new.alerts.error",this.hass.language))}}render(){return this.hass?d`
            <div class="fields-grid">
                ${rt(this._formData,this.hass.language).map(this._renderField)}
            </div>

            <ha-expansion-panel
                header="${c("panel.cards.new.sections.optional",this.hass.language)}"
                .opened=${this._advancedOpen}
                @opened-changed=${e=>this._advancedOpen=e.detail.value}
                class="extras-panel"
            >
                <div class="fields-grid">
                    ${this._renderField(at)}
                    ${nt(this.groups,this.hass.language).map(this._renderField)}
                    ${this._renderField(ot(!1))}
                </div>

                <div class="section-label">
                    ${c("panel.cards.new.sections.notifications",this.hass.language)}
                </div>
                <div class="fields-grid">
                    ${st(this._formData,Ze(this.hass),this.hass.language).map(this._renderField)}
                </div>
            </ha-expansion-panel>
        `:d``}};se.styles=[I,it,S`
        .section-label {
            font-weight: 500;
            color: var(--secondary-text-color);
            margin: 20px 0 12px;
        }
    `],p([w()],se.prototype,"hass",2),p([w({attribute:!1})],se.prototype,"groups",2),p([v()],se.prototype,"_formData",2);customElements.get("hm-task-form")||customElements.define("hm-task-form",se);var M=class extends T{constructor(){super(...arguments);this.groups=[];this._open=!1;this._submitting=!1}async open(e){this._open=!0,await this.updateComplete,e&&this._form?.prefill(e)}_close(){this._open=!1}async _submit(){if(!this._submitting){this._submitting=!0;try{await this._form?.submit()}finally{this._submitting=!1}}}_browseTemplates(){this._close(),this.dispatchEvent(new CustomEvent("browse-templates",{bubbles:!0,composed:!0}))}render(){if(!this.hass||!this._open)return d``;let e=this.hass.language;return d`
            <ha-dialog
                open
                heading=${c("panel.cards.new.title",e)}
                header-title=${c("panel.cards.new.title",e)}
                prevent-scrim-close
                @closed=${this._close}
            >
                <hm-task-form
                    .hass=${this.hass}
                    .groups=${this.groups}
                    @task-added=${this._close}
                ></hm-task-form>

                ${R(d`
                    <ha-button appearance="plain" slot="secondaryAction" @click=${this._browseTemplates}>
                        ${c("panel.cards.current.filter.templates",e)}
                    </ha-button>
                    <ha-button
                        data-dialog="close"
                        appearance="plain"
                        slot="secondaryAction"
                        @click=${this._close}
                    >
                        ${c("common.cancel",e)}
                    </ha-button>
                    <ha-button
                        slot="primaryAction"
                        class="submit-button"
                        ?disabled=${this._submitting}
                        @click=${this._submit}
                    >
                        ${c("panel.cards.new.actions.add_task",e)}
                    </ha-button>
                `)}
            </ha-dialog>
        `}};M.styles=I,p([w()],M.prototype,"hass",2),p([w({attribute:!1})],M.prototype,"groups",2),p([v()],M.prototype,"_open",2),p([v()],M.prototype,"_submitting",2),p([D("hm-task-form")],M.prototype,"_form",2);customElements.get("hm-add-task-dialog")||customElements.define("hm-add-task-dialog",M);var H=class extends T{constructor(){super(...arguments);this.registry=[];this.labelRegistry=[];this.groups=[];this._taskId=null;this._formData=he();this._history=[];this._handleFieldChanged=(e,r)=>{r.stopPropagation(),this._formData={...this._formData,[e]:r.detail.value}};this._renderField=e=>tt({hass:this.hass,keyPrefix:"panel.dialog.edit_task.fields",data:this._formData,onChange:this._handleFieldChanged},e)}async open(e){try{let r=await Vi(this.hass,e),a=this.registry.find(o=>o.unique_id===r.id),n=a?this.labelRegistry.filter(o=>a.labels.includes(o.label_id)):[];this._formData=mr(r,a,n),this._history=r.history??[],this._taskId=r.id}catch(r){console.error("Failed to fetch task for edit:",r)}}async _handleSaveClick(){if(!this._taskId)return;if(!lt(this._formData)){E(this,c("panel.cards.new.alerts.required",this.hass.language));return}let e=pe(this._formData.last_performed);if(e===null){E(this,c("common.invalid_date",this.hass.language));return}try{await Qe(this.hass,{task_id:this._taskId,updates:yr(this._formData,e)}),this._close()}catch(r){console.error("Failed to update task:",r),E(this,c("panel.dialog.edit_task.alerts.error",this.hass.language))}}_close(){this._taskId=null,this._formData=he(),this._history=[]}async _handleTestNotification(){let e=this.registry.find(r=>r.unique_id===this._taskId);if(e)try{await this.hass.callService("tasks","send_task_notification",{entity_id:e.entity_id})}catch(r){console.error("Failed to send test notification:",r),E(this,c("panel.dialog.edit_task.alerts.test_error",this.hass.language))}}render(){if(!this.hass||!this._taskId)return d``;let e=this.hass.language;return d`
            <ha-dialog
                open
                heading="${c("panel.dialog.edit_task.title",e)}: ${this._formData.title}"
                header-title="${c("panel.dialog.edit_task.title",e)}: ${this._formData.title}"
                prevent-scrim-close
                @closed=${this._close}
            >
                <div class="fields-grid">
                    ${rt(this._formData,e).map(this._renderField)}
                    ${this._renderField(at)}
                </div>

                <div class="section-label">
                    ${c("panel.dialog.edit_task.sections.optional",e)}
                </div>

                <div class="fields-grid">
                    ${nt(this.groups,e).map(this._renderField)}
                    ${this._renderField(ot(!0))}
                </div>

                <div class="section-label">
                    ${c("panel.dialog.edit_task.sections.notifications",e)}
                </div>

                <div class="fields-grid">
                    ${st(this._formData,Ze(this.hass),e).map(this._renderField)}
                </div>
                ${this._formData.notifications_enabled?d`
                    <ha-button
                        appearance="plain"
                        size="small"
                        class="test-notification"
                        @click=${this._handleTestNotification}
                    >
                        ${c("panel.dialog.edit_task.actions.test_notification",e)}
                    </ha-button>
                `:""}

                ${this._history.length?d`
                    <div class="section-label">
                        ${c("panel.dialog.edit_task.sections.history",e)}
                    </div>
                    <div class="history-scroll">
                        ${Xe(this._history,this._history.length,this.hass.locale)}
                    </div>
                `:f}

                ${R(d`
                    <ha-button
                        data-dialog="close"
                        appearance="plain"
                        slot="secondaryAction"
                        @click=${this._close}
                    >
                        ${c("panel.dialog.edit_task.actions.cancel",e)}
                    </ha-button>
                    <ha-button slot="primaryAction" @click=${this._handleSaveClick}>
                        ${c("panel.dialog.edit_task.actions.save",e)}
                    </ha-button>
                `)}
            </ha-dialog>
        `}};H.styles=[I,it,Ye,S`
        .section-label {
            font-weight: 500;
            color: var(--secondary-text-color);
            margin: 20px 0 12px;
        }

        .test-notification {
            margin-top: 12px;
        }
    `],p([w()],H.prototype,"hass",2),p([w({attribute:!1})],H.prototype,"registry",2),p([w({attribute:!1})],H.prototype,"labelRegistry",2),p([w({attribute:!1})],H.prototype,"groups",2),p([v()],H.prototype,"_taskId",2),p([v()],H.prototype,"_formData",2),p([v()],H.prototype,"_history",2);customElements.get("hm-edit-dialog")||customElements.define("hm-edit-dialog",H);var Q=class extends T{constructor(){super(...arguments);this.groups=[];this._task=null;this._groupId=""}open(e){this._task=e,this._groupId=e.group_id??""}_close(){this._task=null}async _handleMove(){if(this._task)try{await Qe(this.hass,{task_id:this._task.id,updates:{group_id:this._groupId?.trim()||null}}),this._close()}catch(e){console.error("Failed to move task:",e)}}render(){if(!this.hass||!this._task)return d``;let e=this.hass.language;return d`
            <ha-dialog
                open
                heading="${c("panel.dialog.move_task.title",e)}: ${this._task.title}"
                header-title="${c("panel.dialog.move_task.title",e)}: ${this._task.title}"
                @closed=${this._close}
            >
                <ha-form
                    .hass=${this.hass}
                    .schema=${[Ut(this.groups,e)]}
                    .computeLabel=${()=>c("panel.dialog.move_task.fields.group_id.heading",e)}
                    .data=${{group_id:this._groupId}}
                    @value-changed=${r=>this._groupId=r.detail.value.group_id??""}
                ></ha-form>

                ${R(d`
                    <ha-button
                        data-dialog="close"
                        appearance="plain"
                        slot="secondaryAction"
                        @click=${this._close}
                    >
                        ${c("panel.dialog.move_task.actions.cancel",e)}
                    </ha-button>
                    <ha-button slot="primaryAction" @click=${this._handleMove}>
                        ${c("panel.dialog.move_task.actions.move",e)}
                    </ha-button>
                `)}
            </ha-dialog>
        `}};Q.styles=I,p([w()],Q.prototype,"hass",2),p([w({attribute:!1})],Q.prototype,"groups",2),p([v()],Q.prototype,"_task",2),p([v()],Q.prototype,"_groupId",2);customElements.get("hm-move-dialog")||customElements.define("hm-move-dialog",Q);var vr=["hvac","plumbing","electrical","appliances","interior","exterior","yard","safety","vehicles"],h=(t,i,e,r,a,n)=>({category:t,title:i,description:e,interval_value:r,interval_type:a,icon:n}),Gt=[h("hvac","Replace HVAC filter","Replace the furnace/air-handler filter; check size and MERV rating.",3,"months","mdi:air-filter"),h("hvac","Service furnace","Annual professional furnace inspection and tune-up before heating season.",1,"years","mdi:fire"),h("hvac","Service air conditioner","Annual professional A/C inspection and refrigerant check before cooling season.",1,"years","mdi:air-conditioner"),h("hvac","Clean A/C condenser coils","Rinse debris from the outdoor condenser unit and clear vegetation around it.",6,"months","mdi:hvac"),h("hvac","Clean air vents and registers","Vacuum supply and return registers; check for blockages.",6,"months","mdi:air-purifier"),h("hvac","Clean ceiling fan blades","Dust fan blades and check for wobble; reverse direction seasonally.",6,"months","mdi:ceiling-fan"),h("hvac","Replace humidifier filter","Replace the whole-home humidifier evaporator pad.",1,"years","mdi:air-humidifier"),h("hvac","Clean dehumidifier","Empty, clean the tank and filter, and check drainage.",3,"months","mdi:water-percent"),h("hvac","Have air ducts inspected","Inspect ductwork for leaks and dust buildup; consider cleaning.",5,"years","mdi:pipe"),h("hvac","Clean bathroom exhaust fans","Remove covers and vacuum dust from bathroom exhaust fans.",6,"months","mdi:fan"),h("plumbing","Flush water heater","Drain sediment from the water heater tank and test the pressure-relief valve.",1,"years","mdi:water-boiler"),h("plumbing","Test sump pump","Pour water into the sump pit and verify the pump runs and drains.",3,"months","mdi:water-pump"),h("plumbing","Clean faucet aerators","Unscrew aerators and rinse out sediment for steady flow.",6,"months","mdi:faucet"),h("plumbing","Check for plumbing leaks","Inspect under sinks, around toilets, and exposed pipes for moisture.",3,"months","mdi:pipe-leak"),h("plumbing","Clean shower heads","Descale shower heads with vinegar to restore spray pattern.",6,"months","mdi:shower-head"),h("plumbing","Inspect washing machine hoses","Check supply hoses for bulges or leaks; replace every 5 years.",6,"months","mdi:washing-machine"),h("plumbing","Clean garbage disposal","Freshen the disposal with ice, citrus peel, and a rinse.",1,"months","mdi:sink"),h("plumbing","Snake slow drains","Clear hair and buildup from bathroom drains before they clog.",6,"months","mdi:pipe-wrench"),h("plumbing","Inspect toilet internals","Check flapper, fill valve, and for silent leaks with a dye test.",1,"years","mdi:toilet"),h("plumbing","Service water softener","Check salt level and clean the brine tank.",1,"months","mdi:water-opacity"),h("plumbing","Replace water filter cartridge","Replace under-sink or whole-home water filter cartridges.",6,"months","mdi:filter"),h("plumbing","Winterize outdoor faucets","Disconnect hoses, drain exterior spigots, and insulate before frost.",1,"years","mdi:snowflake-alert"),h("electrical","Test GFCI outlets","Press test/reset on every GFCI outlet to verify protection.",6,"months","mdi:power-socket-us"),h("electrical","Test AFCI breakers","Trip and reset arc-fault breakers in the panel.",6,"months","mdi:electric-switch"),h("electrical","Inspect electrical panel","Look for corrosion, heat marks, or loose breakers; label circuits.",1,"years","mdi:lightning-bolt"),h("electrical","Check cords and outlets","Inspect for frayed cords, warm outlets, and overloaded strips.",1,"years","mdi:power-plug"),h("electrical","Test backup generator","Run the generator under load and check oil and fuel.",3,"months","mdi:engine"),h("electrical","Replace UPS batteries","Test uninterruptible power supplies and replace aging batteries.",3,"years","mdi:battery-charging"),h("electrical","Dust electronics and vents","Blow dust from equipment vents, routers, and media consoles.",3,"months","mdi:desktop-classic"),h("appliances","Clean refrigerator coils","Vacuum condenser coils under/behind the fridge for efficiency.",6,"months","mdi:fridge"),h("appliances","Replace refrigerator water filter","Swap the fridge water/ice filter cartridge.",6,"months","mdi:cup-water"),h("appliances","Clean dishwasher filter","Remove and rinse the dishwasher filter; wipe door seals.",1,"months","mdi:dishwasher"),h("appliances","Run dishwasher cleaner","Run an empty hot cycle with dishwasher cleaner or vinegar.",3,"months","mdi:dishwasher-alert"),h("appliances","Clean washing machine","Run a tub-clean cycle and wipe the door gasket to prevent mildew.",3,"months","mdi:washing-machine"),h("appliances","Clean dryer lint duct","Disconnect the dryer and clear lint from the duct to the exterior vent.",1,"years","mdi:tumble-dryer"),h("appliances","Vacuum dryer lint housing","Vacuum the lint-screen housing and behind the dryer.",3,"months","mdi:tumble-dryer-alert"),h("appliances","Clean oven","Deep-clean the oven interior and door glass.",6,"months","mdi:stove"),h("appliances","Clean range hood filter","Degrease the range hood mesh filter in hot soapy water.",3,"months","mdi:fan"),h("appliances","Descale coffee maker","Run a descaling cycle through the coffee maker or espresso machine.",3,"months","mdi:coffee-maker"),h("appliances","Clean microwave and seals","Clean interior, turntable, and check door seals.",1,"months","mdi:microwave"),h("appliances","Defrost chest freezer","Defrost and clean the freezer; check door gaskets.",1,"years","mdi:fridge-bottom"),h("appliances","Replace vacuum filters","Replace or wash vacuum cleaner filters and check the brush roll.",6,"months","mdi:robot-vacuum"),h("interior","Deep clean carpets","Shampoo or steam-clean carpets and rugs.",1,"years","mdi:rug"),h("interior","Wash windows inside","Clean interior window glass, sills, and tracks.",6,"months","mdi:window-closed-variant"),h("interior","Clean window treatments","Dust or launder blinds, shades, and curtains.",6,"months","mdi:blinds"),h("interior","Touch up paint and caulk","Touch up wall paint; re-caulk tubs, showers, and backsplashes.",1,"years","mdi:format-paint"),h("interior","Lubricate door hinges and locks","Silence squeaks and lubricate locks with graphite.",1,"years","mdi:door"),h("interior","Clean baseboards and trim","Wipe down baseboards, door frames, and switch plates.",3,"months","mdi:broom"),h("interior","Rotate mattresses","Rotate (and flip if applicable) mattresses for even wear.",3,"months","mdi:bed"),h("interior","Wash pillows and duvets","Launder pillows, duvets, and mattress protectors.",6,"months","mdi:bed-king"),h("interior","Inspect attic and basement","Look for leaks, pests, and mold in the attic and basement/crawlspace.",6,"months","mdi:home-search"),h("interior","Check door and window seals","Inspect weatherstripping and replace worn seals.",1,"years","mdi:window-shutter"),h("interior","Clean light fixtures","Dust fixtures and wash glass shades; replace dim bulbs.",6,"months","mdi:ceiling-light"),h("interior","Descale humidifiers","Descale and disinfect portable humidifiers.",1,"months","mdi:air-humidifier"),h("exterior","Clean gutters","Remove leaves and debris from gutters and check downspout flow.",6,"months","mdi:home-roof"),h("exterior","Inspect roof","Check shingles/flashing for damage from the ground or ladder.",1,"years","mdi:home-alert"),h("exterior","Wash siding","Rinse or soft-wash siding to remove dirt and mildew.",1,"years","mdi:home-modern"),h("exterior","Wash windows outside","Clean exterior window glass and screens.",6,"months","mdi:window-open-variant"),h("exterior","Inspect driveway and walkways","Look for cracks to seal and settled pavers to relevel.",1,"years","mdi:road-variant"),h("exterior","Seal deck or fence","Clean and re-stain/seal wooden decks and fences.",2,"years","mdi:fence"),h("exterior","Inspect exterior paint and caulk","Check for peeling paint and failed caulk around openings.",1,"years","mdi:brush"),h("exterior","Clean garage door tracks","Clear tracks, lubricate rollers/springs, and test auto-reverse.",1,"years","mdi:garage"),h("exterior","Inspect foundation","Walk the foundation looking for new cracks or water pooling.",1,"years","mdi:home-floor-b"),h("exterior","Check chimney and cap","Inspect the chimney exterior and cap; schedule a sweep if used.",1,"years","mdi:fireplace"),h("exterior","Clean outdoor furniture","Wash outdoor furniture and check covers.",6,"months","mdi:table-chair"),h("exterior","Clean grill","Deep-clean grill grates and burners; check propane connections.",6,"months","mdi:grill"),h("yard","Fertilize lawn","Apply seasonal fertilizer appropriate for your grass type.",3,"months","mdi:grass"),h("yard","Prune trees and shrubs","Prune dead growth and branches near the house or lines.",1,"years","mdi:tree"),h("yard","Mulch garden beds","Refresh mulch in planting beds for moisture and weed control.",1,"years","mdi:flower"),h("yard","Service lawn mower","Change oil, sharpen the blade, and replace the spark plug.",1,"years","mdi:mower"),h("yard","Start up irrigation system","Recharge the sprinkler system and check heads in spring.",1,"years","mdi:sprinkler-variant"),h("yard","Winterize irrigation system","Blow out sprinkler lines before the first freeze.",1,"years","mdi:sprinkler"),h("yard","Clean and store hoses","Drain garden hoses and check spray nozzles.",1,"years","mdi:watering-can"),h("yard","Inspect trees after storms","Check for damaged limbs and clear debris.",6,"months","mdi:tree-outline"),h("yard","Reseed bare lawn spots","Overseed thin areas and water until established.",1,"years","mdi:seed"),h("safety","Test smoke detectors","Press the test button on every smoke detector.",1,"months","mdi:smoke-detector"),h("safety","Test carbon monoxide detectors","Test CO detectors and note their replacement date.",1,"months","mdi:molecule-co"),h("safety","Replace detector batteries","Replace batteries in smoke and CO detectors.",1,"years","mdi:battery-alert"),h("safety","Inspect fire extinguishers","Check gauge pressure, pin, and expiration on each extinguisher.",6,"months","mdi:fire-extinguisher"),h("safety","Practice fire escape plan","Review and practice the household emergency escape plan.",1,"years","mdi:exit-run"),h("safety","Check emergency kit","Rotate water, food, batteries, and medications in the emergency kit.",6,"months","mdi:medical-bag"),h("safety","Test security system","Test alarm sensors, cameras, and backup batteries.",6,"months","mdi:shield-home"),h("safety","Clean dryer vent exterior flap","Verify the exterior dryer vent flap opens and is lint-free.",6,"months","mdi:tumble-dryer"),h("safety","Test water shutoff valve","Exercise the main water shutoff so it moves freely in an emergency.",1,"years","mdi:valve"),h("safety","Restock first aid kit","Replace used and expired first aid supplies.",6,"months","mdi:bandage"),h("vehicles","Change vehicle oil","Change engine oil and filter per the manufacturer schedule.",6,"months","mdi:oil"),h("vehicles","Rotate tires","Rotate tires and check tread depth and pressure.",6,"months","mdi:tire"),h("vehicles","Replace wiper blades","Replace windshield wiper blades and top up washer fluid.",1,"years","mdi:wiper"),h("vehicles","Check vehicle battery","Test battery health and clean terminal corrosion.",1,"years","mdi:car-battery"),h("vehicles","Replace cabin air filter","Replace the vehicle cabin air filter.",1,"years","mdi:car-defrost-front"),h("vehicles","Wash and wax vehicle","Wash, decontaminate, and wax the paint.",3,"months","mdi:car-wash"),h("vehicles","Check bicycle tune-up","Lubricate the chain, check brakes and tire pressure.",6,"months","mdi:bike")];var L=class extends T{constructor(){super(...arguments);this._open=!1;this._query="";this._csvRows=null;this._csvErrors=[];this._importing=!1;this._close=()=>{this._open=!1,this._query="",this._resetCsv()}}open(){this._open=!0}_resetCsv(){this._csvRows=null,this._csvErrors=[],this._importing=!1,this._fileInput&&(this._fileInput.value="")}get _filteredTemplates(){let e=this._query.trim().toLowerCase();return e?Gt.filter(r=>`${r.title}
${r.description}`.toLowerCase().includes(e)):Gt}_selectTemplate(e){this.dispatchEvent(new CustomEvent("template-selected",{detail:{template:e},bubbles:!0,composed:!0})),this._close()}async _handleFilePicked(e){let r=e.target.files?.[0];if(!r)return;let a=await r.text(),n=Mi(Fi(a));this._csvRows=n.tasks,this._csvErrors=n.errors}async _handleImport(){if(!this._csvRows?.length||this._importing)return;this._importing=!0;let e=0,r=[];for(let a of this._csvRows)try{await Je(this.hass,{title:a.title,interval_value:a.interval_value,interval_type:a.interval_type,trigger_type:"time",last_performed:pe(a.last_performed??""),icon:a.icon||"mdi:calendar-check",...a.description?{description:a.description}:{},...a.group_id?{group_id:a.group_id}:{}}),e+=1}catch(n){console.error("Failed to import task:",a.title,n),r.push(a.title)}this.dispatchEvent(new CustomEvent("csv-imported",{detail:{created:e,failures:r},bubbles:!0,composed:!0})),this._close()}_renderCsvSection(){let e=this.hass.language;return d`
            <div class="csv-section">
                <div class="csv-actions">
                    <ha-button appearance="plain" size="small" @click=${()=>this._fileInput?.click()}>
                        ${c("panel.dialog.templates.choose_csv",e)}
                    </ha-button>
                    <input type="file" accept=".csv,text/csv" hidden @change=${this._handleFilePicked} />
                    <span class="csv-hint">${c("panel.dialog.templates.csv_hint",e)}</span>
                </div>

                ${this._csvErrors.length?d`
                    <ul class="csv-errors">
                        ${this._csvErrors.map(r=>d`<li>${r}</li>`)}
                    </ul>
                `:f}

                ${this._csvRows?.length?d`
                    <div class="csv-preview">
                        <table>
                            <thead>
                                <tr>
                                    <th>${c("panel.dialog.templates.preview.title",e)}</th>
                                    <th>${c("panel.dialog.templates.preview.interval",e)}</th>
                                    <th>${c("panel.dialog.templates.preview.last_performed",e)}</th>
                                    <th>${c("panel.dialog.templates.preview.group",e)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this._csvRows.map(r=>d`
                                    <tr>
                                        <td>${r.title}</td>
                                        <td>${Ge(r.interval_value,r.interval_type,e)}</td>
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
                        ${c("panel.dialog.templates.import_count",e,"{count}",this._csvRows.length)}
                    </ha-button>
                `:this._csvRows!==null&&!this._csvErrors.length?d`
                    <span class="csv-hint">${c("panel.dialog.templates.csv_empty",e)}</span>
                `:f}
            </div>
        `}render(){if(!this.hass||!this._open)return d``;let e=this.hass.language,r=this._filteredTemplates;return d`
            <ha-dialog
                open
                heading="${c("panel.dialog.templates.title",e)}"
                header-title="${c("panel.dialog.templates.title",e)}"
                @closed=${this._close}
            >
                <input
                    class="search-input"
                    type="search"
                    .value=${this._query}
                    placeholder=${c("panel.dialog.templates.search",e)}
                    @input=${a=>{this._query=a.target.value}}
                />

                <div class="template-list">
                    ${vr.map(a=>{let n=r.filter(o=>o.category===a);return n.length?d`
                            <div class="category-header">
                                ${c(`templates.categories.${a}`,e)}
                            </div>
                            ${n.map(o=>d`
                                <button class="template-row" @click=${()=>this._selectTemplate(o)}>
                                    <ha-icon .icon=${o.icon}></ha-icon>
                                    <span class="template-text">
                                        <span class="template-title">${o.title}</span>
                                        <span class="template-detail">
                                            ${Ge(o.interval_value,o.interval_type,e)} — ${o.description}
                                        </span>
                                    </span>
                                </button>
                            `)}
                        `:f})}
                    ${r.length===0?d`
                        <span class="csv-hint">${c("panel.dialog.templates.no_matches",e)}</span>
                    `:f}
                </div>

                <div class="section-label">${c("panel.dialog.templates.import_csv",e)}</div>
                ${this._renderCsvSection()}

                ${R(d`
                    <ha-button data-dialog="close" appearance="plain" slot="secondaryAction" @click=${this._close}>
                        ${c("common.cancel",e)}
                    </ha-button>
                `)}
            </ha-dialog>
        `}};L.styles=[I,S`
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
    `],p([w()],L.prototype,"hass",2),p([v()],L.prototype,"_open",2),p([v()],L.prototype,"_query",2),p([v()],L.prototype,"_csvRows",2),p([v()],L.prototype,"_csvErrors",2),p([v()],L.prototype,"_importing",2),p([D('input[type="file"]')],L.prototype,"_fileInput",2);customElements.get("hm-template-dialog")||customElements.define("hm-template-dialog",L);var jn=300,Vn=880,br="tasks.panel.group_by",qn=()=>{try{return localStorage.getItem(br)==="group"?"group":"status"}catch{return"status"}},Wn=t=>t&&/^[a-z-]+$/.test(t)?`var(--${t}-color)`:t||"var(--primary-color)",A=class extends T{constructor(){super(...arguments);this._loaded=!1;this.tasks=[];this.groups=[];this.config=null;this.registry=[];this.labelRegistry=[];this._selectedLabels=[];this._groupFilter=null;this._groupBy=qn();this._wide=!0;this._groupsDialogOpen=!1;this._reload=new Ue(()=>this._loadData(),jn);this._resizeObserver=new ResizeObserver(e=>{let a=(e[0]?.contentRect.width??0)>=Vn;a!==this._wide&&(this._wide=a)})}connectedCallback(){super.connectedCallback(),this._resizeObserver.observe(this),this._initialize()}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver.disconnect(),this._reload.cancel(),this._unsubscribe?.(),this._unsubscribe=void 0}willUpdate(e){if((e.has("tasks")||e.has("groups"))&&this._groupFilter!==null){let r=this._groupFilter;(r===""?this.tasks.some(n=>!n.group_id?.trim()):this.groups.includes(r))||(this._groupFilter=null)}}async _initialize(){await Di(),this.config=await Qi(this.hass),await this._loadData(),this._loaded=!0,this._openEditFromUrl();try{this._unsubscribe=await Ki(this.hass,()=>this._reload.schedule())}catch(e){console.error("Failed to subscribe to task updates:",e)}}async _loadData(){let[e,r,a,n]=await Promise.all([ji(this.hass),Zi(this.hass),Ui(this.hass),Gi(this.hass)]);this.tasks=e,this.groups=r,this.registry=a,this.labelRegistry=n}async _openEditFromUrl(){let e=new URL(window.location.href),r=e.searchParams.get("edit");r&&(e.searchParams.delete("edit"),history.replaceState(history.state,"",e.pathname+e.search+e.hash),!(!this._canManage||!this.tasks.some(a=>a.id===r))&&(await this.updateComplete,this._editDialog?.open(r)))}_handleMove(e){let r=this.tasks.find(a=>a.id===e.detail.taskId);r&&this._moveDialog?.open(r)}_handleTaskAdded(e){E(this,c("card.add_task.added",this.hass.language,"{title}",e.detail?.title??""))}_handleTemplateSelected(e){let r=e.detail.template;this._addDialog?.open({title:r.title,description:r.description,trigger_type:"time",interval_value:r.interval_value,interval_type:r.interval_type,icon:r.icon})}_handleCsvImported(e){let{created:r,failures:a}=e.detail;E(this,c("panel.dialog.templates.imported",this.hass.language,"{count}",r)),a.length&&E(this,c("panel.dialog.templates.import_failed",this.hass.language,"{titles}",a.join(", ")))}_handleExportCsv(){let e=new Blob([Oi(this.tasks)],{type:"text/csv"}),r=URL.createObjectURL(e),a=document.createElement("a");a.href=r,a.download="tasks.csv",a.click(),URL.revokeObjectURL(r)}_handleGroupByChanged(e){this._groupBy=e.detail.groupBy;try{localStorage.setItem(br,this._groupBy)}catch{}}_toggleLabel(e){this._selectedLabels=this._selectedLabels.includes(e)?this._selectedLabels.filter(r=>r!==e):[...this._selectedLabels,e]}get _visibleTasks(){let e=this._visibleCache;if(e&&e.tasks===this.tasks&&e.registry===this.registry&&e.labels===this._selectedLabels)return e.result;let r=Ve(this.tasks,this.registry,"",this._selectedLabels);return this._visibleCache={tasks:this.tasks,registry:this.registry,labels:this._selectedLabels,result:r},r}get _labelsInUse(){let e=this._labelsInUseCache;if(e&&e.tasks===this.tasks&&e.registry===this.registry&&e.labelRegistry===this.labelRegistry)return e.result;let r=new Set,a=new Set(this.tasks.map(o=>o.id));this.registry.forEach(o=>{a.has(o.unique_id)&&o.labels.forEach(l=>r.add(l))});let n=this.labelRegistry.filter(o=>r.has(o.label_id));return this._labelsInUseCache={tasks:this.tasks,registry:this.registry,labelRegistry:this.labelRegistry,result:n},n}get _labelsByTask(){let e=this._labelsByTaskCache;if(e&&e.registry===this.registry&&e.labelRegistry===this.labelRegistry)return e.result;let r=new Map(this.labelRegistry.map(n=>[n.label_id,n])),a=new Map;return this.registry.forEach(n=>{if(n.platform!=="tasks"||!n.labels.length)return;let o=n.labels.map(l=>r.get(l)).filter(l=>!!l);o.length&&a.set(n.unique_id,o)}),this._labelsByTaskCache={registry:this.registry,labelRegistry:this.labelRegistry,result:a},a}get _canManage(){return!!this.hass?.user?.is_admin}get _dueSoonDays(){return this.config?.due_soon_days??14}get _heading(){let e=this.hass.language;return this._groupFilter===null?c("panel.nav.all_tasks",e):this._groupFilter===""?c("common.ungrouped",e):this._groupFilter}render(){if(!this.hass)return d``;if(!this._loaded)return d`<p class="loading">${c("common.loading",this.hass.language)}</p>`;let e=this.hass.language,r=this._wide,a=this._canManage;return d`
            <div class="header">
                <div class="toolbar ${r?"":"compact"}">
                    <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
                    <div class="main-title">${this.config?.options.sidebar_title}</div>
                    ${a?this._renderToolbarButton("mdi:book-open-variant-outline",c("panel.cards.current.filter.templates",e),()=>this._templateDialog?.open()):f}
                    ${this._renderToolbarButton("mdi:tray-arrow-down",c("panel.cards.current.filter.export",e),this._handleExportCsv)}
                    ${r||!a?f:this._renderToolbarButton("mdi:folder-cog-outline",c("panel.toolbar.manage_groups",e),()=>this._groupsDialogOpen=!0)}
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
                    `:f}
                    <ha-card class="list-card">
                        ${this.tasks.length?this._renderList():this._renderOnboarding()}
                    </ha-card>
                </div>
            </div>

            ${a?this._renderManagement():f}
        `}_renderManagement(){let e=this.hass.language;return d`
            <button class="fab" @click=${()=>this._addDialog?.open()}>
                <ha-icon icon="mdi:plus"></ha-icon>
                <span>${c("panel.toolbar.add_task",e)}</span>
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
            ${this._groupsDialogOpen?this._renderGroupsDialog():f}
        `}_renderToolbarButton(e,r,a){return d`
            <button
                class="toolbar-button ${this._wide?"":"icon-only"}"
                @click=${a}
                title=${r}
                aria-label=${r}
            >
                <ha-icon .icon=${e}></ha-icon>
                ${this._wide?d`<span>${r}</span>`:f}
            </button>
        `}_renderList(){let e=this.hass.language,r=this._labelsInUse;return d`
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
                                    style=${`--label-color: ${Wn(a.color)}`}
                                    aria-pressed=${n?"true":"false"}
                                    @click=${()=>this._toggleLabel(a.label_id)}
                                >
                                    <ha-icon .icon=${a.icon||"mdi:label-outline"}></ha-icon>
                                    ${a.name}
                                </button>
                            `})}
                        ${this._selectedLabels.length?d`
                            <button class="label-filter clear" @click=${()=>this._selectedLabels=[]}>
                                ${c("panel.cards.current.filter.clear",e)}
                            </button>
                        `:f}
                    </div>
                `:f}
            </hm-task-list>
        `}_renderOnboarding(){let e=this.hass.language;return d`
            <div class="onboarding">
                <div class="onboarding-icon"><ha-icon icon="mdi:home-heart"></ha-icon></div>
                <h2>${c("panel.empty.title",e)}</h2>
                ${this._canManage?d`
                    <p>${c("panel.empty.message",e)}</p>
                    <div class="onboarding-actions">
                        <button class="primary-button" @click=${()=>this._addDialog?.open()}>
                            <ha-icon icon="mdi:plus"></ha-icon>
                            ${c("panel.toolbar.add_task",e)}
                        </button>
                        <button class="secondary-button" @click=${()=>this._templateDialog?.open()}>
                            <ha-icon icon="mdi:book-open-variant-outline"></ha-icon>
                            ${c("panel.cards.current.filter.templates",e)}
                        </button>
                    </div>
                `:d`
                    <p>${c("panel.empty.message_readonly",e)}</p>
                `}
            </div>
        `}_renderGroupsDialog(){let e=this.hass.language,r=()=>this._groupsDialogOpen=!1;return d`
            <ha-dialog
                open
                heading=${c("panel.toolbar.manage_groups",e)}
                header-title=${c("panel.toolbar.manage_groups",e)}
                @closed=${a=>{a.target===a.currentTarget&&r()}}
            >
                <hm-group-nav
                    .hass=${this.hass}
                    .groups=${this.groups}
                    .tasks=${this.tasks}
                    .dueSoonDays=${this._dueSoonDays}
                    manageOnly
                ></hm-group-nav>
                ${R(d`
                    <ha-button slot="primaryAction" data-dialog="close" @click=${r}>
                        ${c("panel.nav.done_editing",e)}
                    </ha-button>
                `)}
            </ha-dialog>
        `}};A.styles=[I,ce,S`
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
    `],p([w()],A.prototype,"hass",2),p([w()],A.prototype,"narrow",2),p([v()],A.prototype,"_loaded",2),p([v()],A.prototype,"tasks",2),p([v()],A.prototype,"groups",2),p([v()],A.prototype,"config",2),p([v()],A.prototype,"registry",2),p([v()],A.prototype,"labelRegistry",2),p([v()],A.prototype,"_selectedLabels",2),p([v()],A.prototype,"_groupFilter",2),p([v()],A.prototype,"_groupBy",2),p([v()],A.prototype,"_wide",2),p([v()],A.prototype,"_groupsDialogOpen",2),p([D("hm-add-task-dialog")],A.prototype,"_addDialog",2),p([D("hm-edit-dialog")],A.prototype,"_editDialog",2),p([D("hm-move-dialog")],A.prototype,"_moveDialog",2),p([D("hm-template-dialog")],A.prototype,"_templateDialog",2);customElements.define("tasks-panel",A);export{A as TasksPanel};
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
