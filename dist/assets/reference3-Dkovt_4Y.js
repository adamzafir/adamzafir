import"./modulepreload-polyfill-B5Qt9EMX.js";import*as a from"https://cdn.jsdelivr.net/npm/three@0.171.0/build/three.module.js";let l,d,M,E,z,b,A=[],P,V,p,F=[],S,w=0,x=!1,v;const D=.74;function Y(){E=new a.Clock,l=new a.Scene,l.background=new a.Color(0),l.fog=new a.FogExp2(0,.006),d=new a.PerspectiveCamera(50,window.innerWidth/window.innerHeight,.1,500),d.position.set(0,2,14),M=new a.WebGLRenderer({canvas:document.getElementById("scene"),antialias:!0}),M.setSize(window.innerWidth,window.innerHeight),M.setPixelRatio(Math.min(window.devicePixelRatio,2)),M.toneMapping=a.ACESFilmicToneMapping,M.toneMappingExposure=1,X(),Z(),J(),K(),Q(),O(),$(),tt(),window.addEventListener("resize",ot),window.addEventListener("scroll",et,{passive:!0}),U()}const R=`
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,T=`
  uniform float u_time;
  uniform float u_scroll;
  uniform vec3 u_cameraPos;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Voronoi crack pattern
  float crackPattern(vec2 p, float scale, float sharpness) {
    p *= scale;
    vec2 i = floor(p);
    vec2 f = fract(p);
    float d1 = 1.0;
    float d2 = 1.0;
    for (int x = -1; x <= 1; x++) {
      for (int y = -1; y <= 1; y++) {
        vec2 n = vec2(float(x), float(y));
        vec2 pt = n + hash(i + n) * 0.82 - f;
        // second hash dimension
        pt.y += fract(sin(dot(i + n, vec2(269.5, 183.3))) * 43758.5) * 0.18;
        float d = length(pt);
        if (d < d1) { d2 = d1; d1 = d; }
        else if (d < d2) { d2 = d; }
      }
    }
    float edge = d2 - d1;
    return 1.0 - smoothstep(0.0, sharpness, edge);
  }

  // Branching line crack
  float lineCrack(vec2 p, float scale, float t) {
    p *= scale;
    float v = 0.0;
    // Horizontal-ish cracks
    float y1 = sin(p.x * 1.7 + t * 0.3) * 0.5 + sin(p.x * 3.1 - t * 0.2) * 0.3;
    v = max(v, 1.0 - smoothstep(0.0, 0.08, abs(p.y - y1)));
    // Vertical-ish cracks
    float x1 = sin(p.y * 2.3 + t * 0.25) * 0.4 + sin(p.y * 1.1 + t * 0.15) * 0.5;
    v = max(v, 1.0 - smoothstep(0.0, 0.06, abs(p.x - x1)));
    // Diagonal
    float d1 = sin((p.x + p.y) * 1.9 - t * 0.2) * 0.3;
    v = max(v, 1.0 - smoothstep(0.0, 0.07, abs(p.x - p.y * 0.7 - d1)));
    return v;
  }

  void main() {
    vec3 viewDir = normalize(u_cameraPos - vWorldPos);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 4.0);
    vec3 baseColor = vec3(0.032) + fresnel * vec3(0.06, 0.055, 0.05);

    // Map 3D position to 2D surface coords
    // Use normal to determine which face we're on
    vec3 absN = abs(vNormal);
    vec2 uv;
    if (absN.x > absN.y && absN.x > absN.z) {
      uv = vec2(vPosition.z * 0.5 + 0.5, vPosition.y / 16.0 + 0.5);
    } else if (absN.z > absN.y) {
      uv = vec2(vPosition.x / 4.0 + 0.5, vPosition.y / 16.0 + 0.5);
    } else {
      uv = vec2(vPosition.x / 4.0 + 0.5, vPosition.z * 0.5 + 0.5);
    }

    float scroll = u_scroll;
    float t = u_time;

    // Layer 1: Fine hairline voronoi cracks — appear first
    float c1 = crackPattern(uv + t * 0.008, 9.0, 0.035);
    float layer1 = c1 * smoothstep(0.02, 0.15, scroll);

    // Layer 2: Medium cracks with slight animation
    float c2 = crackPattern(uv * 1.2 + vec2(3.7, 1.2) + t * 0.012, 5.5, 0.055);
    float layer2 = c2 * smoothstep(0.13, 0.32, scroll);

    // Layer 3: Large fracture lines
    float c3 = crackPattern(uv * 0.7 + vec2(7.1, 4.3) + t * 0.006, 3.2, 0.075);
    float layer3 = c3 * smoothstep(0.28, 0.48, scroll);

    // Layer 4: Deep structural cracks
    float c4 = lineCrack(uv + vec2(2.3, 8.1), 2.5, t * 0.4);
    float layer4 = c4 * smoothstep(0.42, 0.65, scroll);

    // Combine
    float cracks = max(max(layer1, layer2), max(layer3, layer4));

    // Intensity ramp — more crack than surface at high scroll
    float intensity = 1.0 + smoothstep(0.4, 0.75, scroll) * 3.0;
    cracks = clamp(cracks * intensity, 0.0, 1.0);

    // Gentle pulse
    float pulse = 0.92 + 0.08 * sin(t * 1.5 + cracks * 5.0);
    cracks *= pulse;

    // Glow bleed: soften crack edges
    float bleedAmount = 0.015 + scroll * 0.03;
    float bleed = 0.0;
    for (int i = 0; i < 4; i++) {
      float angle = float(i) * 1.5708;
      vec2 off = vec2(cos(angle), sin(angle)) * bleedAmount;
      float s1 = crackPattern(uv + off + t * 0.008, 9.0, 0.035) * smoothstep(0.02, 0.15, scroll);
      float s2 = crackPattern(uv * 1.2 + vec2(3.7, 1.2) + off + t * 0.012, 5.5, 0.055) * smoothstep(0.13, 0.32, scroll);
      bleed += max(s1, s2);
    }
    bleed *= 0.25 * 0.35;
    float totalGlow = max(cracks, bleed);

    // Vibration at high scroll
    if (scroll > 0.55) {
      float vStr = smoothstep(0.55, 0.74, scroll);
      float vibr = sin(t * 35.0 + vPosition.y * 8.0) * 0.015 * vStr;
      totalGlow = clamp(totalGlow + vibr, 0.0, 1.0);
    }

    // Crack color: amber -> white at center
    vec3 amber = vec3(1.0, 0.584, 0.0);
    vec3 hotWhite = vec3(1.0, 0.95, 0.88);
    vec3 crackColor = mix(amber, hotWhite, totalGlow * totalGlow);

    // Inner ambient glow at high scroll
    float ambientGlow = smoothstep(0.45, 0.74, scroll) * 0.1;

    vec3 color = mix(baseColor, crackColor, totalGlow) + amber * ambientGlow;

    gl_FragColor = vec4(color, 1.0);
  }
`;function X(){const t=new a.BoxGeometry(4,16,1,32,64,8);b=new a.ShaderMaterial({vertexShader:R,fragmentShader:T,uniforms:{u_time:{value:0},u_scroll:{value:0},u_cameraPos:{value:new a.Vector3}}}),z=new a.Mesh(t,b),z.position.set(0,0,0),l.add(z)}function Z(){const t=new a.BoxGeometry(4,16,1,4,8,2),e=new a.MeshBasicMaterial({color:394758,transparent:!0,opacity:.1});S=new a.Mesh(t,e),S.position.set(0,-16.5,0),S.scale.y=-1,l.add(S)}function O(){const t=new a.PlaneGeometry(300,300),e=new a.MeshBasicMaterial({color:65793,transparent:!0,opacity:.5}),o=new a.Mesh(t,e);o.rotation.x=-Math.PI/2,o.position.y=-8.5,l.add(o)}function J(){const e=new Float32Array(6e3);for(let i=0;i<2e3;i++){const r=i*3,c=Math.random()*Math.PI*2,s=Math.acos(2*Math.random()-1),m=80+Math.random()*150;e[r]=m*Math.sin(s)*Math.cos(c),e[r+1]=Math.abs(m*Math.cos(s))*.6+10,e[r+2]=m*Math.sin(s)*Math.sin(c)}const o=new a.BufferGeometry;o.setAttribute("position",new a.BufferAttribute(e,3));const n=new a.PointsMaterial({color:16777215,size:.15,sizeAttenuation:!0,transparent:!0,opacity:.6});V=new a.Points(o,n),l.add(V)}function K(){const e=new Float32Array(900),o=[];for(let r=0;r<300;r++){const c=r*3;e[c]=(Math.random()-.5)*12,e[c+1]=(Math.random()-.5)*20,e[c+2]=(Math.random()-.5)*8,o.push({x:(Math.random()-.5)*.003,y:(Math.random()-.5)*.004,z:(Math.random()-.5)*.003})}const n=new a.BufferGeometry;n.setAttribute("position",new a.BufferAttribute(e,3));const i=new a.PointsMaterial({color:16749824,size:.05,sizeAttenuation:!0,transparent:!0,opacity:.3});p=new a.Points(n,i),p.userData.velocities=o,l.add(p)}function Q(){for(let e=0;e<6;e++){const o=e/6*Math.PI*2,n=20,i=.25+Math.random()*.35,r=new a.PlaneGeometry(i,n),c=new a.MeshBasicMaterial({color:16749824,transparent:!0,opacity:0,side:a.DoubleSide,blending:a.AdditiveBlending,depthWrite:!1}),s=new a.Mesh(r,c);s.position.set(Math.cos(o)*.65,0,Math.sin(o)*.65),s.rotation.y=o+Math.PI/2,s.userData.baseAngle=o,s.userData.rotSpeed=.04+Math.random()*.08,F.push(s),l.add(s)}}function $(){const t=new a.SphereGeometry(.15,16,16),e=new a.MeshBasicMaterial({color:16749824,transparent:!0,opacity:0,blending:a.AdditiveBlending});v=new a.Mesh(t,e),v.position.set(0,0,0),l.add(v)}function tt(){P=new a.Group,P.visible=!1,l.add(P);const t=6,e=16,o=2,n=4,i=16,r=1,c=n/t,s=i/e,m=r/o;for(let k=0;k<t;k++)for(let y=0;y<e;y++)for(let G=0;G<o;G++){const W=c*(.65+Math.random()*.55),L=s*(.65+Math.random()*.55),N=m*(.65+Math.random()*.55),I=new a.BoxGeometry(W,L,N,1,2,1),u=I.attributes.position;for(let h=0;h<u.count;h++)u.setX(h,u.getX(h)+(Math.random()-.5)*W*.15),u.setY(h,u.getY(h)+(Math.random()-.5)*L*.1),u.setZ(h,u.getZ(h)+(Math.random()-.5)*N*.15);u.needsUpdate=!0,I.computeVertexNormals();const j=new a.ShaderMaterial({vertexShader:R,fragmentShader:T,uniforms:{u_time:{value:0},u_scroll:{value:.74},u_cameraPos:{value:new a.Vector3}},transparent:!0}),g=new a.Mesh(I,j),_=-n/2+c*(k+.5)+(Math.random()-.5)*c*.25,C=-i/2+s*(y+.5)+(Math.random()-.5)*s*.25,H=-r/2+m*(G+.5)+(Math.random()-.5)*m*.25;g.position.set(_,C,H),g.userData.originalPos=new a.Vector3(_,C,H);const B=new a.Vector3(_,C*.3,H).normalize();B.x+=(Math.random()-.5)*.7,B.y+=(Math.random()-.5)*.6,B.z+=(Math.random()-.5)*.7,B.normalize();const q=6+Math.random()*18;g.userData.velocity=B.multiplyScalar(q),g.userData.rotAxis=new a.Vector3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize(),g.userData.rotSpeed=1+Math.random()*4,P.add(g),A.push(g)}}function et(){const t=document.getElementById("scroll-container").scrollHeight-window.innerHeight;w=Math.max(0,Math.min(1,window.scrollY/t))}function ot(){d.aspect=window.innerWidth/window.innerHeight,d.updateProjectionMatrix(),M.setSize(window.innerWidth,window.innerHeight)}function at(t){const e=t*Math.PI*1.55,o=13,n=Math.sin(t*Math.PI),i=o-n*2.5,r=-3+t*10,c=Math.sin(e)*i,s=Math.cos(e)*i;d.position.set(c,r,s),d.lookAt(0,r*.15,0)}function nt(t){const e=document.getElementById("hero");t<.1?e.style.opacity=1:t<.17?e.style.opacity=Math.max(0,1-(t-.1)/.07):e.style.opacity=0,f(document.getElementById("quote1"),t,.15,.24),f(document.getElementById("quote2"),t,.2,.28),f(document.getElementById("quote3"),t,.25,.33),f(document.getElementById("bio-panel"),t,.31,.43),f(document.getElementById("project1"),t,.36,.47),f(document.getElementById("project2"),t,.43,.53),f(document.getElementById("project3"),t,.49,.58),f(document.getElementById("contact-panel"),t,.57,.73);const o=document.getElementById("finale");o.style.opacity=t>.93?Math.min(1,(t-.93)/.05):0}function f(t,e,o,n){e>=o&&e<=n?t.classList.add("visible"):t.classList.remove("visible")}function it(t){if(t>=D&&!x?(x=!0,z.visible=!1,S.visible=!1,P.visible=!0,A.forEach(e=>{e.position.copy(e.userData.originalPos),e.rotation.set(0,0,0),e.material.opacity=1,e.visible=!0})):t<D&&x&&(x=!1,z.visible=!0,S.visible=!0,P.visible=!1),x){const e=(t-D)/(1-D);if(A.forEach(o=>{const n=Math.max(0,e),i=Math.max(0,(e-.35)/.4),r=Math.max(0,(e-.78)/.22),c=1+n*.4,s=i*i,m=o.userData.originalPos.clone().multiplyScalar(c),k=o.userData.velocity.clone().multiplyScalar(s*2.5);if(o.position.copy(m).add(k),i>0){const y=i*o.userData.rotSpeed*2;o.rotation.x=o.userData.rotAxis.x*y,o.rotation.y=o.userData.rotAxis.y*y,o.rotation.z=o.userData.rotAxis.z*y}o.material.opacity=1-r,o.material.uniforms.u_scroll.value=.74}),v){const o=Math.max(0,(e-.5)/.5);v.material.opacity=o*.9;const n=1+Math.sin(E.getElapsedTime()*2)*.2;v.scale.setScalar(n*(.5+o*1.5))}}else v&&(v.material.opacity=0)}function st(){if(!p)return;const t=p.geometry.attributes.position.array,e=p.userData.velocities;for(let o=0;o<e.length;o++){const n=o*3;t[n]+=e[o].x,t[n+1]+=e[o].y,t[n+2]+=e[o].z,t[n]>6&&(t[n]=-6),t[n]<-6&&(t[n]=6),t[n+1]>10&&(t[n+1]=-10),t[n+1]<-10&&(t[n+1]=10),t[n+2]>4&&(t[n+2]=-4),t[n+2]<-4&&(t[n+2]=4)}p.geometry.attributes.position.needsUpdate=!0,p.material.opacity=.15+w*.5}function rt(t,e){F.forEach(o=>{const n=Math.max(0,(e-.08)/.55);o.material.opacity=Math.min(.1,n*.1);const i=o.userData.baseAngle+t*o.userData.rotSpeed;o.position.x=Math.cos(i)*.75,o.position.z=Math.sin(i)*.75,o.rotation.y=i+Math.PI/2,e>.3&&e<.7&&(o.material.opacity+=.04*Math.sin((e-.3)/.4*Math.PI)),e>.88&&(o.material.opacity*=Math.max(0,1-(e-.88)/.12))})}function U(){requestAnimationFrame(U),E.getDelta();const t=E.getElapsedTime();b&&(b.uniforms.u_time.value=t,b.uniforms.u_scroll.value=Math.min(w,D),b.uniforms.u_cameraPos.value.copy(d.position)),x&&A.forEach(e=>{e.material.uniforms.u_time.value=t,e.material.uniforms.u_cameraPos.value.copy(d.position)}),at(w),nt(w),it(w),st(),rt(t,w),M.render(l,d)}Y();
