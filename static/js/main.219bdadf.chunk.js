(this.webpackJsonpreact_quiz_eng=this.webpackJsonpreact_quiz_eng||[]).push([[0],[,,,,,,,,,,,,,,function(e,n,t){},function(e,n,t){},function(e,n,t){},function(e,n,t){},,function(e,n,t){},function(e,n,t){},function(e,n,t){},function(e,n,t){},function(e,n,t){},function(e,n,t){},function(e,n,t){},function(e,n,t){},function(e,n,t){},function(e,n,t){"use strict";t.r(n);var r=t(0),a=t.n(r),c=t(9),i=t.n(c),o=(t(14),t(15),t(5)),s=t(3),d=t(2),u=t(4),l=(t(16),t(17),t(1)),j=function(e){var n=e.src,t="avatar__img";return Object(l.jsx)("div",{className:"avatar",children:n?Object(l.jsx)("img",{className:t,src:n,alt:"avatar"}):Object(l.jsx)("div",{className:"".concat(t,"-default")})})},b=(t(19),function(e){var n=e.content,t=e.onclickHandler,r=["button"];return e.isTranslate&&r.push("button_moved"),Object(l.jsx)("button",{onClick:t,className:r.join(" "),children:n})}),f=(t(20),function(e){var n=e.content;return Object(l.jsx)("span",{className:"sentence-word",children:n})}),w=(t(21),function(e){var n=e.content;return Object(l.jsx)("h1",{className:"title",children:n})}),O=(t(22),function(e){var n=e.children;return Object(l.jsxs)("div",{className:"sentence",children:[Object(l.jsx)("span",{className:"sentence__tip"}),Object(l.jsx)("ul",{className:"sentence__word-list",children:n})]})}),g=500,m={x:0,y:0},h={shiftX:0,shiftY:0,initialX:0,initialY:0},I={originId:0,wordId:0},p=function(e,n){return e.map((function(e,t){return{anchorId:t,isHidden:"answers"===n,answerId:null,isPrepared:!1}}))},v=function(e){return Array.isArray(e)?e.reduce((function(e,n){return Object(d.a)(Object(d.a)({},e),{},Object(o.a)({},n.anchorId,Object(d.a)({},n)))}),{}):Object.values(e)},x=function(e){return e.reduce((function(e,n){return Object(d.a)(Object(d.a)({},e),{},Object(o.a)({},n.wordId,Object(d.a)({},n)))}),{})},A=function e(n){return Array.from(n.children).reduce((function(n,t){return 0===t.children.length||t.children[0].matches(".answer-word")?[].concat(Object(s.a)(n),[t]):[].concat(Object(s.a)(n),Object(s.a)(e(t)))}),[])},y=function(e,n,t){var r=(null!==t&&void 0!==t?t:{direction:"left"}).direction,a=k(e);return n.reduce((function(e,n){return Object(d.a)(Object(d.a)({},e),{},Object(o.a)({},n,{x:a["right"===r?n+1:n-1].x-a[n].x,y:a["right"===r?n+1:n-1].y-a[n].y}))}),{})},k=function(e){return A(e).map((function(e){return{x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y}}))},C=function(e,n,t){var r=e.wordsList,a=e.wordsArea,c=function(e){return e.wordId-o>1?(i=!0,!1):(o+=1,!0)},i=!("waiting"===n.from||r.find((function(e){return e.wordId===n.originId}))),o="put"===t?n.originId:n.wordId;return r.filter((function(e){return"waiting"===a?!i&&("put"===t?e.wordId>=n.originId&&c(e):e.wordId>n.wordId&&c(e)):e.wordId>n.wordId})).map((function(e){return e.wordId}))},L=function(e,n){var t,r=v(e);switch(n){case"setBusy":t=Object(s.a)(e).reverse().find((function(e){return e.isPrepared}));break;case"delBusy":t=Object(s.a)(e).reverse().find((function(e){return null!==e.answerId}));break;case"disprepare":t=Object(s.a)(e).reverse().find((function(e){return e.isPrepared&&null===e.answerId}));break;case"prepareLast":t=Object(s.a)(e).reverse().find((function(e){return null!==e.answerId}));break;default:t=e.find((function(e){return null===e.answerId}))}return t&&(r[t.anchorId]=Object(d.a)(Object(d.a)({},t),{},{isPrepared:"prepare"===n||"prepareLast"===n,answerId:"setBusy"===n||"prepareLast"===n?t.anchorId:null})),v(r)},N=function(e,n,t,r){var a=r.elementAction,c=r.directionShift;return("add"===a?e:e.filter((function(e){return e.wordId!==n}))).map((function(e){return t.includes(e.wordId)?Object(d.a)(Object(d.a)({},e),{},{wordId:"right"===c?e.wordId+1:e.wordId-1}):e}))},S=(t(23),function(e){var n=e.content,t=e.isError,r=[],a=[];return n&&r.push("message_show"),t&&a.push("message__text_wrong"),Object(l.jsx)("div",{className:"message ".concat(r.join(" ")),children:Object(l.jsx)("span",{className:"message__text ".concat(a.join(" ")),children:n})})}),H=(t(24),function(e){var n=e.content,t=e.style,r=e.onMouseDown;return Object(l.jsx)("span",{style:null!==t&&void 0!==t?t:null,onMouseDown:null!==r&&void 0!==r?r:null,className:["answer-word"].join(" "),children:n})}),_=a.a.memo(H),E=(t(25),function(e){var n=e.draggableElemInfo,t=e.children,c=e.isTransitioned,i=e.originCoords,o=e.dragStartHandler,j=e.dragMoveHandler,b=e.dragEndHandler,f=e.isBlockAnimaton,w=Object(r.useState)(!1),O=Object(u.a)(w,2),I=O[0],p=O[1],v=Object(r.useState)(null),x=Object(u.a)(v,2),A=x[0],y=x[1],k=Object(r.useRef)(!1),C=Object(r.useRef)("waiting"===n.from?"waitingArea":"answersArea"),L=Object(r.useRef)("waiting"===n.from?"waitingArea":"answersArea"),N=Object(r.useRef)(),S=Object(r.useState)(m),H=Object(u.a)(S,2),_=H[0],E=H[1],B=Object(r.useState)(h),P=Object(u.a)(B,2),T=P[0],R=P[1],M=Object(r.useCallback)((function(e){return k.current&&e?(L.current===e||(L.current=e),e):"out-".concat(L.current)}),[]),X=Object(r.useCallback)((function(e){return!!e&&!(!e.dataset.dropname&&!e.matches('[data-anchor="waitingAnchor"]'))}),[]),Y=Object(r.useCallback)((function(e,n,t){e.classList.add("hidden");var r=function(e,n){var t;return Array.isArray(e)?e.reduce((function(e,t){var r,a,c;return null===e&&null!==(r=document).elementFromPoint.apply(r,Object(s.a)(n))&&(a=document).elementFromPoint.apply(a,Object(s.a)(n)).closest(t)?(c=document).elementFromPoint.apply(c,Object(s.a)(n)).closest(t):e}),null):(t=document).elementFromPoint.apply(t,Object(s.a)(n)).closest(e)}(['[data-anchor="waitingAnchor"]',".drop-area"],[n,t]);return e.classList.remove("hidden"),null!==r&&void 0!==r?r:document.elementFromPoint(n,t)}),[]),F=Object(r.useCallback)((function(e){var t=e.target;t.classList.add("draggable"),p(!0),y(t),R((function(n){return Object(d.a)(Object(d.a)({},n),{},{shiftX:e.clientX-t.getBoundingClientRect().x,shiftY:e.clientY-t.getBoundingClientRect().y,initialX:t.getBoundingClientRect().x,initialY:t.getBoundingClientRect().y})})),o({from:n.from,dragId:n.wordId}),t.ondragstart=function(){return!1}}),[o,n]),q=Object(r.useCallback)((function(e){var t=e.clientX,r=e.clientY,a=e.target,c=Y(a,t,r);k.current=X(c);var i=M(function(e){return e&&0!==Object.keys(e.dataset).length?e.dataset.dropname?e.dataset.dropname:e.dataset.anchor:null}(c));i!==N.current&&(N.current=i,C.current=i,j({from:n.from,currentArea:C.current})),E((function(e){return Object(d.a)(Object(d.a)({},e),{},{x:t-T.initialX-T.shiftX,y:r-T.initialY-T.shiftY})})),c&&(c.ondragstart=function(){return!1})}),[j,n.from,Y,X,M,T.initialX,T.initialY,T.shiftX,T.shiftY]),D=Object(r.useCallback)((function(e){var t=e.clientX,r=e.clientY,a=e.target;null===A||void 0===A||A.classList.remove("draggable");var c=Y(a,t,r);p(!1),E(m),b({from:n.from,originId:n.originId,dragId:n.wordId,currentArea:C.current,anchorId:c&&(c.dataset.id||"0"===c.dataset.id)?Number(c.dataset.id):null})}),[b,null===A||void 0===A?void 0:A.classList,n.from,n.originId,n.wordId,Y]);Object(r.useEffect)((function(){return I&&!f?(window.addEventListener("mousemove",q),window.addEventListener("mouseup",D)):(window.removeEventListener("mousemove",q),window.removeEventListener("mouseup",D)),function(){window.removeEventListener("mousemove",q),window.removeEventListener("mouseup",D)}}),[D,q,f,I]);var z=Object(r.useMemo)((function(){return{willChange:"transform",transform:I?"translate(\n      ".concat(_.x+i.x,"px, \n      ").concat(_.y+i.y,"px)"):"translate(".concat(i.x,"px, ").concat(i.y,"px)"),transition:I||c?"":"transform ".concat(g,"ms ease")}}),[I,c,i.x,i.y,_.x,_.y]);return Object(l.jsx)(r.Fragment,{children:a.a.Children.map(t,(function(e){return a.a.cloneElement(e,Object(d.a)(Object(d.a)({},e.props),{},{style:z,onMouseDown:f?null:F}))}))})}),B=a.a.memo(E),P=(t(26),t(27),function(e){var n=e.children,t=e.isHidden,r=e.isPrepared,a=e.isDataAttr,c=e.id,i=["anchor"];return t||i.push("anchor_show"),r&&i.push("anchor_prepared"),Object(l.jsx)("li",{className:i.join(" "),"data-anchor":a?"waitingAnchor":null,"data-id":t?null:c,children:null!==n&&void 0!==n?n:null})}),T=a.a.memo(P),R=Object(r.forwardRef)((function(e,n){var t=e.areaName,r=e.anchors,a=e.words,c=e.originCoords,i=e.dragStartHandler,u=e.dragMoveHandler,j=e.dragEndHandler,b=e.isTransitioned,f=e.isBlockAnimaton,w=a.reduce((function(e,n){return Object(d.a)(Object(d.a)({},e),{},Object(o.a)({},n.wordId,Object(d.a)({},n)))}),{}),O=function(e){var n,t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return Object(l.jsx)(T,{isHidden:e.isHidden,isPrepared:e.isPrepared,isDataAttr:t,id:e.anchorId,children:w[e.anchorId]&&Object(l.jsx)(B,{draggableElemInfo:Object(d.a)({},w[e.anchorId]),isTransitioned:b,originCoords:null!==(n=c[e.anchorId])&&void 0!==n?n:{x:0,y:0},dragStartHandler:i,dragMoveHandler:u,dragEndHandler:j,isBlockAnimaton:f,children:Object(l.jsx)(_,{content:w[e.anchorId].text},w[e.anchorId].wordId)})},e.anchorId)};return"answersArea"===t?Object(l.jsx)("div",{className:"drop-area","data-dropname":t,ref:n,children:Object(s.a)(Array(Math.ceil(r.length/6)).keys()).map((function(e){return r.slice(6*e,6*(e+1))})).map((function(e,n){return Object(l.jsx)("ul",{className:"drop-area__wrapper",children:e.map((function(e){return O(e)}))},n)}))}):Object(l.jsx)("ul",{className:"drop-area","data-dropname":t,ref:n,children:r.map((function(e){return O(e,!0)}))})})),M=function(e){var n=e.sentenceText,t=e.words,a=Object(r.useState)(null),c=Object(u.a)(a,2),i=c[0],m=c[1],h=Object(r.useState)(null),v=Object(u.a)(h,2),H=v[0],_=v[1],E=Object(r.useState)(!1),B=Object(u.a)(E,2),P=B[0],T=B[1],M=Object(r.useState)(""),X=Object(u.a)(M,2),Y=X[0],F=X[1],q=Object(r.useRef)(null),D=Object(r.useRef)(null),z=Object(r.useRef)(!1),W=Object(r.useState)(I),J=Object(u.a)(W,2),G=J[0],K=J[1],Q=Object(r.useState)({}),U=Object(u.a)(Q,2),V=U[0],Z=U[1],$=Object(r.useState)({}),ee=Object(u.a)($,2),ne=ee[0],te=ee[1],re=Object(r.useState)(function(e){return e.map((function(e,n){return{text:e,wordId:n,originId:n,from:"waiting"}}))}(t)),ae=Object(u.a)(re,2),ce=ae[0],ie=ae[1],oe=Object(r.useState)([]),se=Object(u.a)(oe,2),de=se[0],ue=se[1],le=Object(r.useState)(p(t,"answers")),je=Object(u.a)(le,2),be=je[0],fe=je[1],we=Object(r.useCallback)((function(e,n){var t="waiting"===e?V:ne,r="waiting"===e?q.current:D.current,a=C({wordsList:"waiting"===e?ce:de,wordsArea:e},x("waiting"===e?ce:de)[n],"take"),c=y(r,a);return Object(d.a)(Object(d.a)({},t),c)}),[ne,de,V,ce]),Oe=Object(r.useCallback)((function(){return Object(s.a)(be).reverse().find((function(e){return e.isPrepared}))}),[be]),ge=function(e){return e.find((function(e){return null===e.answerId}))},me=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;te({}),Z({}),setTimeout((function(){return T(!1)}),e)},he=Object(r.useCallback)((function(e){var n=e.anchorId,t=e.dragId,r=k(D.current)[n],a=k(q.current)[t];Z(Object(d.a)(Object(d.a)({},V),{},Object(o.a)({},t,{x:r.x-a.x,y:r.y-a.y})))}),[V]),Ie=Object(r.useCallback)((function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:q.current,t=e.dragId,r=e.anchorId,a=k(D.current)[t],c=k(n)[r];te(Object(d.a)(Object(d.a)({},ne),{},Object(o.a)({},t,{x:c.x-a.x,y:c.y-a.y})))}),[ne]),pe=Object(r.useCallback)((function(e){var n=C({wordsList:ce,wordsArea:"waiting"},x(de)[e],"put");Z(Object(d.a)(Object(d.a)({},V),y(q.current,n,{direction:"right"})))}),[de,V,ce]),ve=Object(r.useCallback)((function(){n.filter((function(e){return""!==e.translation})).map((function(e){return e.translation.toLowerCase()})).join(" ")===de.map((function(e){return e.text})).join(" ")?m("is complete!!!"):(_(!0),m("something wrong"))}),[de,n]),xe=Object(r.useCallback)((function(e){var n=e.dragId,t=e.from;z.current=!1,m(null),_(null),"waiting"===t?Z(we("waiting",n)):(fe(L(be,"prepareLast")),te(we("answers",n)))}),[be,we]),Ae=Object(r.useCallback)((function(e){var n=e.from,t=e.currentArea;"waiting"===n&&("answersArea"===t&&fe(L(be,"prepare")),"out-answersArea"===t&&fe(L(be,"disprepare")))}),[be]),ye=Object(r.useCallback)((function(e){var n=e.dragId,t=e.from,r=e.currentArea,a=e.originId,c=e.anchorId;if(T(!0),"waiting"===t&&("answersArea"===r?(he({anchorId:ge(be).anchorId,dragId:n}),K({originId:a,wordId:n}),F("waiting-answers")):me(100)),"answers"===t){var i=function(e,n){return"waitingAnchor"===e&&A(q.current)[n].children[0]}(r,c)?"waitingArea":r;if("waitingArea"===i){Ie({dragId:n,anchorId:a});var o=C({wordsList:ce,wordsArea:"waiting"},x(de)[n],"put");Z(Object(d.a)(Object(d.a)({},V),y(q.current,o,{direction:"right"}))),K({originId:a,wordId:n}),F("answers-waiting")}else"waitingAnchor"===i?(Ie({dragId:n,anchorId:c}),K({wordId:n,originId:a}),F("answers-wrong-waiting")):(T(!0),Ie({dragId:n,anchorId:Oe().anchorId},D.current),K({originId:a,wordId:n}),F("answers-answers"))}}),[he,be,Ie,ce,de,V,Oe]);return Object(r.useEffect)((function(){switch(Y){case"waiting-answers":setTimeout((function(){F(""),z.current=!0,fe(L(be,"setBusy"));var e=C({wordsList:ce,wordsArea:"waiting"},x(ce)[G.wordId],"take");ie(N(ce,G.wordId,e,{elementAction:"remove",directionShift:"left"}));var n=x(ce)[G.wordId];ue([].concat(Object(s.a)(de),[Object(d.a)(Object(d.a)({},n),{},{wordId:ge(be).anchorId,from:"answers"})])),me(100)}),g);break;case"answers-waiting":setTimeout((function(){F(""),z.current=!0;var e=C({wordsList:ce,wordsArea:"waiting"},x(de)[G.wordId],"put"),n=N(ce,G.originId,e,{elementAction:"add",directionShift:"right"}),t=x(n);t[G.originId]=Object(d.a)(Object(d.a)({},x(de)[G.wordId]),{},{from:"waiting",wordId:G.originId}),ie(Object.values(t));var r=C({wordsList:de,wordsArea:"answers"},x(de)[G.wordId],"take"),a=N(de,G.wordId,r,{elementAction:"remove",directionShift:"left"});ue(a),fe(L(be,"delBusy")),me(100)}),g);break;case"answers-wrong-waiting":setTimeout((function(){F(""),pe(G.wordId),Ie({dragId:G.wordId,anchorId:G.originId}),F("answers-waiting")}),1e3);break;case"answers-answers":setTimeout((function(){F(""),z.current=!0;var e=x(de)[G.wordId],n=C({wordsList:de,wordsArea:"answers"},e,"take"),t=N(de,G.wordId,n,{elementAction:"remove",directionShift:"left"});t.push(Object(d.a)(Object(d.a)({},e),{},{wordId:t.length})),ue(t),fe(be.map((function(e){return e.isPrepared?Object(d.a)(Object(d.a)({},e),{},{isPrepared:!1}):e}))),me(100)}),g)}}),[be,de,Y,G,ce,Ie,pe]),Object(l.jsxs)("div",{className:"quiz",children:[Object(l.jsx)(w,{content:"Translate this sentence"}),Object(l.jsxs)("div",{className:"quiz-info",children:[Object(l.jsx)(j,{}),Object(l.jsx)(O,{children:n.map((function(e,n){return Object(l.jsx)("li",{children:Object(l.jsx)(f,{content:e.text})},n)}))})]}),Object(l.jsx)("div",{className:"answers-wrapper",children:Object(l.jsx)(R,{dragStartHandler:xe,dragMoveHandler:Ae,dragEndHandler:ye,originCoords:ne,areaName:"answersArea",words:de,anchors:be,isTransitioned:z.current,isBlockAnimaton:P,ref:D})}),Object(l.jsx)("div",{className:"waiting-wrapper",children:Object(l.jsx)(R,{dragStartHandler:xe,dragMoveHandler:Ae,dragEndHandler:ye,originCoords:V,areaName:"waitingArea",words:ce,anchors:p(t,"waiting"),isTransitioned:z.current,isBlockAnimaton:P,ref:q})}),Object(l.jsx)(S,{content:i,isError:H}),Object(l.jsx)("div",{className:"btn-wrapper",children:Object(l.jsx)(b,{isTranslate:i,onclickHandler:P?null:ve,content:"click"})})]})},X={q1:{sentenceWords:[{text:"He",translation:"\u041e\u043d"},{text:"eats",translation:"\u0415\u0441\u0442"},{text:"fish",translation:"\u0420\u044b\u0431\u0443"},{text:"at",translation:""},{text:"home",translation:"\u0434\u043e\u043c\u0430"}],answersWords:["\u0435\u0441\u0442","\u043e\u043d","\u0434\u043e\u043c\u0430","\u0440\u044b\u0431\u0443"]}}.q1,Y=X.sentenceWords,F=X.answersWords,q=function(){return Object(l.jsx)("div",{className:"App",children:Object(l.jsx)(M,{sentenceText:Y,words:F})})},D=function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,29)).then((function(n){var t=n.getCLS,r=n.getFID,a=n.getFCP,c=n.getLCP,i=n.getTTFB;t(e),r(e),a(e),c(e),i(e)}))};i.a.render(Object(l.jsx)(a.a.StrictMode,{children:Object(l.jsx)(q,{})}),document.getElementById("root")),D()}],[[28,1,2]]]);
//# sourceMappingURL=main.219bdadf.chunk.js.map