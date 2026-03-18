import"./modulepreload-polyfill-B5Qt9EMX.js";import*as t from"https://cdn.jsdelivr.net/npm/three@0.171.0/build/three.module.js";gsap.registerPlugin(ScrollTrigger);const ht=document.getElementById("cosmos"),w=new t.WebGLRenderer({canvas:ht,antialias:!0,alpha:!1});w.setPixelRatio(Math.min(window.devicePixelRatio,2));w.setSize(window.innerWidth,window.innerHeight);w.toneMapping=t.ACESFilmicToneMapping;w.toneMappingExposure=1.2;const r=new t.Scene;r.background=new t.Color(131336);r.fog=new t.FogExp2(131336,.0025);const g=new t.PerspectiveCamera(60,window.innerWidth/window.innerHeight,.1,2e3);g.position.set(0,2,28);const G=new t.Vector3(0,0,0),z=new t.Vector3(-45,10,-70),_=new t.Vector3(55,-6,-155),C=new t.Vector3(-35,5,-240),d=new t.Vector3(0,0,-350),j=3500,vt=new t.IcosahedronGeometry(.12,0),yt=new t.MeshBasicMaterial({color:16777215}),x=new t.InstancedMesh(vt,yt,j),y=new t.Object3D,X=[];for(let e=0;e<j;e++){const o=(Math.random()-.5)*700,a=(Math.random()-.5)*450,s=-Math.random()*550-30;y.position.set(o,a,s);const c=.15+Math.random()*1.3;y.scale.set(c,c,c),y.updateMatrix(),x.setMatrixAt(e,y.matrix),X.push({x:o,y:a,z:s,s:c})}x.instanceMatrix.needsUpdate=!0;r.add(x);const U=500,$=new t.BufferGeometry,E=new Float32Array(U*3),tt=[];for(let e=0;e<U;e++){const o=(Math.random()-.5)*450,a=(Math.random()-.5)*300,s=-Math.random()*500;E[e*3]=o,E[e*3+1]=a,E[e*3+2]=s,tt.push({x:o,y:a,z:s})}$.setAttribute("position",new t.BufferAttribute(E,3));const gt=new t.PointsMaterial({color:8943462,size:.5,transparent:!0,opacity:.3,depthWrite:!1}),b=new t.Points($,gt);r.add(b);function ft(e){const o=document.createElement("canvas");o.width=512,o.height=512;const a=o.getContext("2d"),s=a.createRadialGradient(256,256,0,256,256,256);return s.addColorStop(0,e[0]),s.addColorStop(.35,e[1]),s.addColorStop(.7,e[2]||"rgba(0,0,0,0)"),s.addColorStop(1,"rgba(0,0,0,0)"),a.fillStyle=s,a.fillRect(0,0,512,512),new t.CanvasTexture(o)}function f(e,o,a,s,c,n){const i=ft(c),l=new t.MeshBasicMaterial({map:i,transparent:!0,opacity:n,blending:t.AdditiveBlending,depthWrite:!1,side:t.DoubleSide}),u=new t.Mesh(new t.PlaneGeometry(s,s),l);return u.position.set(e,o,a),r.add(u),u}const wt=[f(40,25,-55,140,["rgba(110,30,160,0.5)","rgba(50,10,90,0.2)","rgba(20,5,40,0.05)"],.22),f(-55,-20,-110,120,["rgba(20,60,160,0.4)","rgba(10,25,90,0.15)"],.18),f(25,15,-185,150,["rgba(160,60,30,0.4)","rgba(90,25,10,0.15)"],.2),f(-45,30,-270,130,["rgba(70,20,130,0.5)","rgba(25,5,65,0.2)"],.2),f(70,-25,-320,100,["rgba(0,90,130,0.35)","rgba(0,35,70,0.12)"],.16),f(-20,-10,-40,80,["rgba(200,100,20,0.25)","rgba(100,40,5,0.1)"],.12)],L=`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Mt=`
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform float u_time;

  void main() {
    vec2 uv = vUv;
    float n1 = sin(uv.x * 10.0 + u_time * 0.8) * cos(uv.y * 8.0 - u_time * 0.7);
    float n2 = sin(uv.x * 20.0 - u_time * 1.3) * cos(uv.y * 15.0 + u_time * 0.5) * 0.5;
    float n3 = sin(uv.x * 5.0 + uv.y * 7.0 + u_time * 0.35) * 0.35;
    float n4 = sin(uv.x * 30.0 + u_time * 2.0) * cos(uv.y * 25.0 - u_time * 1.5) * 0.2;
    float noise = n1 + n2 + n3 + n4;
    float intensity = 0.55 + noise * 0.45;
    intensity = clamp(intensity, 0.0, 1.5);

    vec3 hot = vec3(1.0, 0.88, 0.35);
    vec3 warm = vec3(1.0, 0.5, 0.05);
    vec3 cool = vec3(0.9, 0.2, 0.0);
    vec3 color;
    if (intensity > 0.7) {
      color = mix(warm, hot, (intensity - 0.7) / 0.8);
    } else {
      color = mix(cool, warm, intensity / 0.7);
    }

    float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.2);
    color += vec3(1.0, 0.55, 0.15) * fresnel * 0.65;

    float pulse = 1.0 + sin(u_time * 1.5) * 0.06;
    gl_FragColor = vec4(color * (intensity * 0.7 + 0.45) * pulse, 1.0);
  }
`,et=new t.ShaderMaterial({vertexShader:L,fragmentShader:Mt,uniforms:{u_time:{value:0}}}),F=new t.Mesh(new t.SphereGeometry(8,32,32),et);F.position.copy(G);r.add(F);const q=[];[{r:11,color:16742144,opacity:.09},{r:14,color:16733440,opacity:.05},{r:18,color:16724736,opacity:.025}].forEach(e=>{const o=new t.Mesh(new t.SphereGeometry(e.r,24,24),new t.MeshBasicMaterial({color:e.color,transparent:!0,opacity:e.opacity,blending:t.AdditiveBlending,side:t.BackSide}));o.position.copy(G),r.add(o),q.push(o)});const ot=new t.PointLight(16746496,4,120);ot.position.copy(G);r.add(ot);const xt=`
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform float u_time;
  void main() {
    vec2 uv = vUv;
    float n = sin(uv.x * 8.0 + u_time * 0.5) * cos(uv.y * 6.0 - u_time * 0.35);
    n += sin(uv.x * 16.0 - u_time * 0.9) * cos(uv.y * 13.0 + u_time * 0.45) * 0.4;
    n += sin(uv.y * 20.0 + u_time * 0.7) * 0.2;
    float i = 0.5 + n * 0.5;
    vec3 c1 = vec3(0.0, 0.53, 1.0);
    vec3 c2 = vec3(0.0, 0.8, 0.67);
    vec3 color = mix(c1, c2, i);
    float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0,0.0,1.0)), 0.0), 2.8);
    color += vec3(0.3, 0.7, 1.0) * fresnel * 0.7;
    gl_FragColor = vec4(color * (i * 0.45 + 0.55), 1.0);
  }
`,nt=new t.ShaderMaterial({vertexShader:L,fragmentShader:xt,uniforms:{u_time:{value:0}}}),I=new t.Mesh(new t.SphereGeometry(4,32,32),nt);I.position.copy(z);r.add(I);const D=new t.Mesh(new t.SphereGeometry(5.8,20,20),new t.MeshBasicMaterial({color:26316,transparent:!0,opacity:.06,blending:t.AdditiveBlending,side:t.BackSide}));D.position.copy(z);r.add(D);const it=new t.PointLight(35071,2,70);it.position.copy(z);r.add(it);const bt=`
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform float u_time;
  void main() {
    vec2 uv = vUv;
    float n = sin(uv.x * 7.0 + u_time * 0.45) * cos(uv.y * 9.0 - u_time * 0.6);
    n += sin(uv.x * 14.0 - u_time * 1.0) * cos(uv.y * 11.0 + u_time * 0.4) * 0.45;
    n += cos(uv.x * 22.0 + uv.y * 18.0 - u_time * 0.8) * 0.2;
    float i = 0.5 + n * 0.5;
    vec3 c1 = vec3(0.53, 0.0, 1.0);
    vec3 c2 = vec3(1.0, 0.0, 0.53);
    vec3 color = mix(c1, c2, i);
    float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0,0.0,1.0)), 0.0), 2.5);
    color += vec3(0.75, 0.25, 1.0) * fresnel * 0.6;
    gl_FragColor = vec4(color * (i * 0.45 + 0.55), 1.0);
  }
`,at=new t.ShaderMaterial({vertexShader:L,fragmentShader:bt,uniforms:{u_time:{value:0}}}),N=new t.Mesh(new t.SphereGeometry(5,32,32),at);N.position.copy(_);r.add(N);const St=[{r:9.5,tube:.6,color:8926207,opacity:.28},{r:12,tube:.35,color:16711816,opacity:.14},{r:14.5,tube:.2,color:6693580,opacity:.08}],Y=[];St.forEach(e=>{const o=new t.Mesh(new t.TorusGeometry(e.r,e.tube,2,90),new t.MeshBasicMaterial({color:e.color,wireframe:!0,transparent:!0,opacity:e.opacity}));o.position.copy(_),o.rotation.x=Math.PI*.42,r.add(o),Y.push(o)});const K=new t.Mesh(new t.SphereGeometry(7.5,20,20),new t.MeshBasicMaterial({color:6684876,transparent:!0,opacity:.05,blending:t.AdditiveBlending,side:t.BackSide}));K.position.copy(_);r.add(K);const st=new t.PointLight(8913151,2,70);st.position.copy(_);r.add(st);const _t=`
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform float u_time;
  void main() {
    vec2 uv = vUv;
    float n = sin(uv.x * 9.0 + u_time * 0.6) * cos(uv.y * 7.0 - u_time * 0.45);
    n += sin(uv.x * 17.0 - u_time * 0.75) * cos(uv.y * 14.0 + u_time * 0.55) * 0.38;
    n += sin(uv.y * 22.0 + u_time * 0.5) * 0.18;
    float i = 0.5 + n * 0.5;
    vec3 c1 = vec3(0.0, 1.0, 0.53);
    vec3 c2 = vec3(0.0, 0.67, 1.0);
    vec3 color = mix(c1, c2, i);
    float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0,0.0,1.0)), 0.0), 2.5);
    color += vec3(0.25, 1.0, 0.75) * fresnel * 0.55;
    gl_FragColor = vec4(color * (i * 0.4 + 0.58), 1.0);
  }
`,rt=new t.ShaderMaterial({vertexShader:L,fragmentShader:_t,uniforms:{u_time:{value:0}}}),T=new t.Mesh(new t.SphereGeometry(3,32,32),rt);T.position.copy(C);r.add(T);const Z=new t.Mesh(new t.SphereGeometry(4.5,20,20),new t.MeshBasicMaterial({color:43622,transparent:!0,opacity:.06,blending:t.AdditiveBlending,side:t.BackSide}));Z.position.copy(C);r.add(Z);const ct=new t.PointLight(65416,1.5,55);ct.position.copy(C);r.add(ct);const lt=new t.Mesh(new t.SphereGeometry(12,32,32),new t.MeshBasicMaterial({color:0}));lt.position.copy(d);r.add(lt);const dt=new t.Mesh(new t.SphereGeometry(13.2,32,32),new t.MeshBasicMaterial({color:1114146,transparent:!0,opacity:.5,side:t.BackSide}));dt.position.copy(d);r.add(dt);const k=new t.Mesh(new t.TorusGeometry(13.5,.15,8,120),new t.MeshBasicMaterial({color:16772829,transparent:!0,opacity:.6,blending:t.AdditiveBlending}));k.position.copy(d);k.rotation.x=Math.PI*.5;r.add(k);const M=new t.Mesh(new t.TorusGeometry(13.8,.08,8,120),new t.MeshBasicMaterial({color:16755268,transparent:!0,opacity:.3,blending:t.AdditiveBlending}));M.position.copy(d);M.rotation.x=Math.PI*.48;M.rotation.y=.15;r.add(M);const V=2500,S=new t.BufferGeometry,A=new Float32Array(V*3),P=new Float32Array(V*3),ut=[];for(let e=0;e<V;e++){const o=Math.random()*Math.PI*2,a=15+Math.random()*14,s=(Math.random()-.5)*(.4+(a-15)*.06);A[e*3]=d.x+Math.cos(o)*a,A[e*3+1]=d.y+s,A[e*3+2]=d.z+Math.sin(o)*a;const c=(a-15)/14;P[e*3]=1,P[e*3+1]=.4+(1-c)*.6,P[e*3+2]=(1-c)*.7,ut.push({angle:o,radius:a,baseY:s,speed:.25+1/Math.max(a-13,1)*3.5})}S.setAttribute("position",new t.BufferAttribute(A,3));S.setAttribute("color",new t.BufferAttribute(P,3));const H=new t.PointsMaterial({size:.45,vertexColors:!0,transparent:!0,opacity:.8,blending:t.AdditiveBlending,depthWrite:!1}),kt=new t.Points(S,H);r.add(kt);r.add(new t.AmbientLight(1118498,.25));const h=[{t:0,pos:[0,2,28],look:[0,0,0]},{t:.08,pos:[0,1,22],look:[0,0,0]},{t:.18,pos:[6,4,12],look:[0,0,0]},{t:.25,pos:[-20,12,-35],look:[-45,10,-70]},{t:.32,pos:[-42,12,-58],look:[-45,10,-70]},{t:.38,pos:[-38,14,-68],look:[-45,10,-70]},{t:.44,pos:[-10,18,-95],look:[-5,0,-115]},{t:.5,pos:[30,0,-130],look:[55,-6,-155]},{t:.57,pos:[42,-2,-140],look:[55,-6,-155]},{t:.64,pos:[48,0,-148],look:[55,-6,-155]},{t:.7,pos:[10,8,-195],look:[-35,5,-240]},{t:.76,pos:[-30,8,-228],look:[-35,5,-240]},{t:.82,pos:[-15,5,-275],look:[0,0,-350]},{t:.88,pos:[-5,3,-305],look:[0,0,-350]},{t:.94,pos:[0,1,-325],look:[0,0,-350]},{t:1,pos:[0,0,-338],look:[0,0,-350]}];function Bt(e){let o=h[0],a=h[0];for(let i=0;i<h.length-1;i++)if(e>=h[i].t&&e<=h[i+1].t){o=h[i],a=h[i+1];break}e>=h[h.length-1].t&&(o=a=h[h.length-1]);const s=a.t-o.t,c=s>0?Math.max(0,Math.min(1,(e-o.t)/s)):0,n=c*c*(3-2*c);return{pos:new t.Vector3(o.pos[0]+(a.pos[0]-o.pos[0])*n,o.pos[1]+(a.pos[1]-o.pos[1])*n,o.pos[2]+(a.pos[2]-o.pos[2])*n),look:new t.Vector3(o.look[0]+(a.look[0]-o.look[0])*n,o.look[1]+(a.look[1]-o.look[1])*n,o.look[2]+(a.look[2]-o.look[2])*n)}}const pt={progress:0};ScrollTrigger.create({trigger:"body",start:"top top",end:"bottom bottom",scrub:.6,onUpdate:e=>{pt.progress=e.progress}});const Et=document.getElementById("hero-section"),At=document.getElementById("philosophy-section"),Pt=document.getElementById("projects-section"),Gt=document.getElementById("contact-section"),O=document.getElementById("footer-section"),R=document.getElementById("flash"),J=document.querySelector(".scroll-hint");function B(e,o,a,s,c){if(e<o||e>c)return 0;if(e>=a&&e<=s)return 1;if(e<a){const l=(e-o)/(a-o);return l*l*(3-2*l)}const n=(e-s)/(c-s);return 1-n*n*(3-2*n)}function zt(e){const o=B(e,0,0,.14,.22),a=B(e,.26,.3,.36,.42),s=B(e,.5,.54,.62,.67),c=B(e,.72,.74,.78,.83);[[Et,o],[At,a],[Pt,s],[Gt,c]].forEach(([l,u])=>{l.style.opacity=u;const p=u>.12;l.classList.toggle("is-active",p),l.setAttribute("aria-hidden",String(!p))});const n=e>.96?Math.min(1,(e-.96)/.03):0;O.style.opacity=n;const i=n>.01;if(O.classList.toggle("is-active",i),O.setAttribute("aria-hidden",String(!i)),e>.92&&e<.97){const l=(e-.92)/.05;R.style.opacity=Math.pow(l,4)*.9}else e>=.97?R.style.opacity=Math.max(0,.9-(e-.97)/.03*.9):R.style.opacity=0;J&&(J.style.display=e>.03?"none":"block")}const Q=[{mesh:F,orig:G.clone(),extras:[...q]},{mesh:I,orig:z.clone(),extras:[D]},{mesh:N,orig:_.clone(),extras:[K,...Y]},{mesh:T,orig:C.clone(),extras:[Z]}];function Ct(e,o){if(e<.78){Q.forEach(n=>{n.mesh.position.copy(n.orig),n.extras.forEach(i=>i.position.copy(n.orig)),n.mesh.scale.setScalar(1),n.extras.forEach(i=>i.scale.setScalar(1))});return}const a=Math.min(1,(e-.78)/.22),s=a*a*a;Q.forEach(n=>{const i=new t.Vector3().subVectors(d,n.orig),l=n.orig.clone().add(i.multiplyScalar(s*.92));n.mesh.position.copy(l),n.extras.forEach(m=>m.position.copy(l));const u=Math.max(0,1-s*1.3),p=1+s*2,v=Math.max(.05,u);n.mesh.scale.set(v,v,Math.min(v*p,1.5)),n.extras.forEach(m=>m.scale.set(v,v,v))});for(let n=0;n<j;n++){const i=X[n],l=d.x-i.x,u=d.y-i.y,p=d.z-i.z,v=Math.sqrt(l*l+u*u+p*p),m=s*Math.max(0,1-v/600)*.85;y.position.set(i.x+l*m,i.y+u*m,i.z+p*m);const W=i.s*Math.max(.05,1-s*.9);y.scale.set(W,W,W),y.updateMatrix(),x.setMatrixAt(n,y.matrix)}x.instanceMatrix.needsUpdate=!0;const c=b.geometry.attributes.position.array;for(let n=0;n<U;n++){const i=tt[n],l=d.x-i.x,u=d.y-i.y,p=d.z-i.z,v=Math.sqrt(l*l+u*u+p*p),m=s*Math.max(0,1-v/500)*.8;c[n*3]=i.x+l*m,c[n*3+1]=i.y+u*m,c[n*3+2]=i.z+p*m}b.geometry.attributes.position.needsUpdate=!0,H.opacity=.8+s*.2,H.size=.45+s*2,k.material.opacity=.6+s*.4,M.material.opacity=.3+s*.5}const Ut=new t.Clock;function mt(){requestAnimationFrame(mt);const e=Ut.getElapsedTime(),o=pt.progress;et.uniforms.u_time.value=e,nt.uniforms.u_time.value=e,at.uniforms.u_time.value=e,rt.uniforms.u_time.value=e,F.rotation.y=e*.04,I.rotation.y=e*.07,N.rotation.y=e*.055,T.rotation.y=e*.09,Y.forEach((n,i)=>{n.rotation.z=e*(.08-i*.025)*(i%2===0?1:-1)}),q.forEach((n,i)=>{const l=1+Math.sin(e*(1.8-i*.3)+i)*.05;n.scale.setScalar(l)});const a=S.attributes.position.array,s=1+(o>.78?Math.pow((o-.78)/.22,3)*8:0);for(let n=0;n<V;n++){const i=ut[n];i.angle+=i.speed*.006*s,a[n*3]=d.x+Math.cos(i.angle)*i.radius,a[n*3+1]=d.y+i.baseY+Math.sin(e*1.8+i.angle*2)*.12,a[n*3+2]=d.z+Math.sin(i.angle)*i.radius}if(S.attributes.position.needsUpdate=!0,k.rotation.z=e*.15,M.rotation.z=-e*.1,wt.forEach(n=>n.lookAt(g.position)),o<.78){const n=b.geometry.attributes.position.array;for(let i=0;i<U;i++)n[i*3+1]+=Math.sin(e*.25+i*.5)*.0015,n[i*3]+=Math.cos(e*.15+i*.3)*.001;b.geometry.attributes.position.needsUpdate=!0}const c=Bt(o);g.position.copy(c.pos),g.lookAt(c.look),zt(o),Ct(o),r.fog.density=.0025+(o>.88?(o-.88)/.12*.018:0),w.render(r,g)}mt();window.addEventListener("resize",()=>{g.aspect=window.innerWidth/window.innerHeight,g.updateProjectionMatrix(),w.setSize(window.innerWidth,window.innerHeight)});
