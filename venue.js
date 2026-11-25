(() => {
'use strict';
const PLACES = [
  {"id":1,"name":"Гостиница СОК № 1","marker":[650,242],"height":15,"footprint":[[625,197],[694,209],[667,306],[599,293]]},
  {"id":2,"name":"Зона гостеприимства","marker":[762,293],"height":0,"footprint":[[755,275],[779,278],[770,319],[746,315]],"roofColor":"#bfc1bc","annexes":[{"height":4,"marker":[749,338],"roofColor":"#ae796c","roofStyle":"hospitality-south","footprint":[[741,322],[764,326],[758,355],[735,351]]}]},
  {"id":3,"name":"Контрольно-пропускной пункт (КПП)","marker":[1196,162],"height":4,"footprint":[[1174,149],[1200,154],[1195,179],[1176,181],[1169,174]],"details":["Вход с Соколовской улицы","https://www.google.com/maps/@?api=1&map_action=pano&pano=ctlnBA1Njm47m_wcNUyMrg&heading=155","Панорама"]},
  {"id":4,"name":"Бассейн","marker":[699,123],"height":8,"footprint":[[686,99],[721,105],[713,153],[676,147]]},
  {"id":5,"name":"Универсальный спортивный зал № 1","marker":[751,126],"height":9,"footprint":[[738,85],[782,94],[766,170],[721,160]]},
  {"id":6,"name":"Зал художественной гимнастики","marker":[629,314],"height":7,"footprint":[[597,297],[665,310],[656,346],[588,336]]},
  {"id":7,"name":"Гараж","marker":[715,45],"height":4,"footprint":[[672,20],[746,36],[739,68],[674,55],[666,51]]},
  {"id":8,"name":"Футбольное поле с натуральным газоном (нижнее)","marker":[855,283],"height":0,"footprint":[[811,174],[937,198],[900,391],[768,360]],"details":["Натуральный газон · 110 × 75 м","https://novogorsksport.ru/sportsoourzheniya/futbolnye-polya-copy-4/","УТЦ"]},
  {"id":9,"name":"Гостиница СОК № 2","marker":[1122,327],"height":17,"footprint":[[1150,283],[1139,292],[1115,405],[1087,399],[1099,377],[1111,338],[1129,274]],"annexes":[{"height":6,"marker":[1108,228],"roofStyle":"hotel-north","footprint":[[1071,172],[1168,194],[1150,283],[1129,274],[1111,276],[1098,283],[1053,266],[1054,242]]}]},
  {"id":10,"name":"Гостиница СОК № 3","marker":[994,342],"height":16,"footprint":[[944,401],[948,392],[958,375],[963,350],[968,329],[975,306],[985,290],[991,278],[999,271],[1009,270],[1017,272],[1039,275],[1061,281],[1078,287],[1076,295],[1094,288],[1082,309],[1074,325],[1060,369],[1046,423],[984,408]]},
  {"id":11,"name":"Футбольное поле с натуральным газоном (верхнее)","marker":[820,478],"height":0,"footprint":[[767,370],[915,400],[875,588],[724,553]],"details":["Натуральный газон · 110 × 92 м","https://novogorsksport.ru/sportsoourzheniya/futbolnye-polya-copy-4/","УТЦ"]},
  {"id":12,"name":"Центр лёгкой атлетики","marker":[628,475],"height":14,"footprint":[[596,352],[616,354],[639,357],[666,364],[686,370],[714,382],[674,555],[662,602],[658,608],[538,580]],"annexes":[{"height":7,"footprint":[[711,373],[739,380],[727,434],[710,429],[704,456],[719,461],[710,494],[701,497],[691,558],[671,556]]}]},
  {"id":13,"name":"Поле с искусственным покрытием","marker":[550,676],"height":0,"footprint":[[523,581],[625,605],[588,765],[486,741]],"details":["Игровое поле · 91,4 × 55 м","https://novogorsksport.ru/sportsoourzheniya/pole-s-iskusstvennym-pokrytiem-i-zhidkostnym-podogrevom/","УТЦ"]},
  {"id":14,"name":"Легкоатлетический стадион","marker":[777,709],"height":0,"footprint":[[625,686],[631,653],[643,626],[659,611],[677,603],[700,603],[730,607],[881,637],[904,646],[922,660],[930,678],[937,706],[938,729],[933,754],[924,777],[909,797],[888,807],[863,807],[704,776],[675,769],[653,757],[637,738],[628,715]],"details":["6 беговых дорожек · трибуна на 250 мест","https://novogorsksport.ru/sportsoourzheniya/otkrytyj-legkoatleticheskij-stadion/","УТЦ"]},
  {"id":15,"name":"Поле для метаний","marker":[1046,758],"height":0,"footprint":[[957,720],[1171,764],[1153,843],[927,796]]},
  {"id":16,"name":"Баскетбольная площадка","marker":[948,618],"height":0,"footprint":[[925,594],[974,605],[969,639],[919,628]]},
  {"id":17,"name":"Ледовый манеж","marker":[988,485],"height":10,"footprint":[[949,431],[1063,460],[1048,524],[936,497]],"annexes":[{"height":5,"footprint":[[937,496],[1048,524],[1042,546],[932,523]]}]},
  {"id":18,"name":"Тиры","marker":[1107,540],"height":5,"footprint":[[1068,520],[1160,540],[1152,568],[1059,548]]},
  {"id":19,"name":"Универсальный спортивный зал № 2","marker":[1150,493],"height":8,"footprint":[[1110,450],[1203,472],[1188,537],[1096,518]]},
  {"id":20,"name":"Универсальный спортивный зал № 3","marker":[1226,534],"height":9,"footprint":[[1204,470],[1267,491],[1242,595],[1179,579]]},
  {"id":21,"name":"Гостиница ЦЗВС","marker":[1012,672],"height":15,"footprint":[[1023,600],[1048,606],[1043,625],[1038,627],[1023,699],[990,694],[1000,648],[1008,646],[1015,617],[1020,617]]},
  {"id":22,"name":"Малая ледовая арена ЦЗВС","marker":[1078,633],"height":11,"footprint":[[1064,612],[1175,636],[1156,713],[1047,690]],"details":["Лёд 60 × 26 м · Центр зимних видов спорта","https://novogorsksport.ru/sportsoourzheniya/ledovye-areny/","УТЦ"]},
  {"id":23,"name":"Большая ледовая арена ЦЗВС","marker":[1237,683],"height":14,"footprint":[[1205,613],[1256,626],[1296,643],[1290,668],[1285,670],[1273,735],[1269,736],[1266,751],[1218,736],[1177,723]],"details":["Лёд 60 × 30 м · Центр зимних видов спорта","https://novogorsksport.ru/sportsoourzheniya/ledovye-areny/","УТЦ"],"panorama":"https://www.google.com/maps/@?api=1&map_action=pano&pano=23aCvc8u5cGs08GJ9ijT3A&heading=262","annexes":[{"height":19,"footprint":[[1287,632],[1298,636],[1295,651],[1284,648]]}]},
  {"id":24,"name":"Площадки для кёрлинга","marker":[1120,666],"height":11,"footprint":[[1064,612],[1175,636],[1156,713],[1047,690]],"details":["В здании Центра зимних видов спорта","https://www.mir-sk.com/projects/obshchestvennye-zdaniya/tsentr-zimnikh-vidov-sporta-fgup-utts-novogorsk/","Проект"]}
];

// Общий соединяющий блок Центра зимних видов спорта.
const WINTER_LINK = {"id":0,"height":7,"marker":[1169,666],"footprint":[[1058,599],[1209,628],[1180,729],[1155,720],[1177,638],[1053,617]],"annex":true};
function buildArchitecture(p,deck,svg) {
  const poly=p.footprint||p.poly, id=Number(p.id);
  if (!poly || poly.length<3 || id===24) return;
  const x=poly.map(v=>v[0]), y=poly.map(v=>v[1]);
  const host=svg("g",{"class":"ng-detail","pointer-events":"none","aria-hidden":"true"},deck);
  const key="ng-detail-"+id+"-"+Math.random().toString(36).slice(2,9);
  const clip=svg("clipPath",{id:key,clipPathUnits:"userSpaceOnUse"},host);
  svg("polygon",{points:poly.map(v=>v.join(",")).join(" ")},clip);
  const base=svg("g",{"clip-path":"url(#"+key+")","stroke-linejoin":"round","stroke-linecap":"round"},host);
  let best=null;
  for(let i=0;i<poly.length;i++){
    const j=(i+1)%poly.length, u=x[j]-x[i],v=y[j]-y[i],len=Math.hypot(u,v);
    if(len<1)continue;
    const a=u/len,b=v/len,xx=poly.map(k=>k[0]*a+k[1]*b), yy=poly.map(k=>-k[0]*b+k[1]*a);
    const x0=Math.min(...xx),y0=Math.min(...yy),w=Math.max(...xx)-x0,h=Math.max(...yy)-y0;
    if(best && w*h>=best.area)continue;
    const cx=x0+w/2,cy=y0+h/2;
    let angle=Math.atan2(b,a)*180/Math.PI+(w<h?90:0);
    while(angle>90)angle-=180;while(angle<=-90)angle+=180;
    best={area:w*h,cx:cx*a-cy*b,cy:cx*b+cy*a,w:Math.max(w,h),h:Math.min(w,h),angle};
  }
  if(!best)return;
  const ink="#73776f",light="#969892",pale="#c6c7c0",paper="#fbfbf6";
  const {cx,cy,w,h,angle}=best;
  const g=svg("g",{transform:"translate("+cx+" "+cy+") rotate("+angle+")"},base);
  const draw=(tag,attrs={},parent=g)=>svg(tag,{"fill":"none","stroke":ink,"stroke-width":0.85,...attrs},parent);
  const path=(d,attrs={},parent=g)=>draw("path",{d,...attrs},parent);
  const ln=(x1,y1,x2,y2,col=ink,lw=.85,parent=g)=>draw("line",{x1,y1,x2,y2,stroke:col,"stroke-width":lw},parent);
  const re=(x,y,width,height,attrs={},parent=g)=>draw("rect",{x,y,width,height,...attrs},parent);
  const oval=(x,y,rx,ry,attrs={},parent=g)=>draw("ellipse",{cx:x,cy:y,rx,ry,...attrs},parent);
  const rectAt=(nx,ny,nw,nh,attrs={})=>re(nx*w,ny*h,nw*w,nh*h,attrs);
  const rib=(from,to,count,dir="cross")=>{
    for(let j=0;j<count;j++){const t=from+(to-from)*(j+.5)/count;
      if(dir==="cross")ln(w*t,-h*.47,w*t,h*.47,pale,.64);
      else ln(-w*.47,h*t,w*.47,h*t,pale,.65);
    }
  };
  const vent=(nx,ny,sz=1)=>{
    const vx=nx*w,vy=ny*h,a=4.1*sz,b=2.7*sz;
    re(vx-a+1.2,vy-b+1.5,2*a,2*b,{fill:"#bcbeb6",stroke:"none"});
    re(vx-a,vy-b,2*a,2*b,{fill:paper,stroke:ink,"stroke-width":.8});
    for(let i=-1;i<=1;i++)ln(vx+i*a*.47,vy-b+.9,vx+i*a*.47,vy+b-.9,light,.52);
  };
  const parapet=()=>{
    // Twin narrow strokes follow every corner without rounding concave annexes.
    const pts=poly.map(v=>v.join(",")).join(" ");
    draw("polygon",{points:pts,stroke:"#858880","stroke-width":2.2},base);
    draw("polygon",{points:pts,stroke:"#e7e7e0","stroke-width":.85},base);
  };
  const stripe=(n,a,b)=>{for(let j=0;j<n;j+=2)re(-w*a+w*2*a*j/n,-h*b,w*2*a/n,2*h*b,{stroke:"none",fill:"#e4e6dc"});};
  if(id===8||id===11){
    // Ворота стоят на коротких сторонах. Внешняя сетка привязана к контуру объекта.
    const scale=1.56,W=110*scale,H=(id===8?75:92)*scale;
    const line={stroke:"#fcfaf2","stroke-width":1.15};
    re(-W/2,-H/2,W,H,{fill:"#879d7d",stroke:"none"});
    for(let band=0;band<12;band+=2){
      re(-W/2+W*band/12,-H/2,W/12,H,{fill:id===8?"#9dae8f":"#91a484",stroke:"none"});
    }
    re(-W/2,-H/2,W,H,line);
    ln(0,-H/2,0,H/2,line.stroke,1.15);
    oval(0,0,9.15*scale,9.15*scale,line);
    oval(0,0,1.25,1.25,{fill:line.stroke,stroke:"none"});
    for(const sign of [-1,1]){
      const end=sign*W/2;
      for(const [depth,half] of [[16.5,20.16],[5.5,9.16]]){
        const back=end-sign*depth*scale,d=half*scale;
        path("M"+end+" "+(-d)+"H"+back+"V"+d+"H"+end,line);
      }
      const spot=end-sign*11*scale;
      oval(spot,0,1.2,1.2,{fill:line.stroke,stroke:"none"});
      const edge=end-sign*16.5*scale,arcHalf=7.3*scale;
      path("M"+edge+" "+(-arcHalf)+"A"+(9.15*scale)+" "+(9.15*scale)+" 0 0 "+(sign===1?0:1)+" "+edge+" "+arcHalf,line);
      const goalWidth=7.32*scale,goalDepth=3.6;
      re(Math.min(end,end+sign*goalDepth),-goalWidth/2,goalDepth,goalWidth,
        {fill:"#dce5d6",stroke:"#fffdf7","stroke-width":1.25});
    }
    const fence=poly.map(v=>v.join(",")).join(" ");
    draw("polygon",{points:fence,stroke:"#63785d","stroke-width":2.7,"stroke-dasharray":"2.5 4"},base);
    for(const [i,a] of poly.entries()){
      const b=poly[(i+1)%poly.length];
      for(let t=.16;t<.95;t+=.22){
        const x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;
        oval(x,y,1.25,1.25,{fill:"#567052",stroke:"none"},base);
      }
    }
    return;
  }
  if(id===13){
    stripe(12,.46,.44);
    const [length,width]=[91.4,55];
    const planScale=1.56;
    const W=length*planScale,H=width*planScale,line={stroke:ink,"stroke-width":1};
    re(-W/2,-H/2,W,H,line);
    ln(0,-H/2,0,H/2,ink,1);
    oval(0,0,H*.13,H*.13,line);oval(0,0,.9,.9,{fill:ink,stroke:"none"});
    for(const side of [-1,1]){
      const end=side*W/2;
      for(const [a,b] of [[.155,.30],[.052,.14]]){
        const goal=end-side*W*a;path("M"+end+" "+(-b*H)+" H"+goal+" V"+b*H+" H"+end,line);
      }
      const spot=end-side*W*.106; oval(spot,0,.8,.8,{fill:ink,stroke:"none"});
      const endBox=end-side*W*.155;
      path("M"+endBox+" "+(-H*.115)+" Q"+(endBox-side*W*.07)+" 0 "+endBox+" "+H*.115,line);
    } return;
  }
  if(id===14){
    // Шесть дорожек. Старт и финиш показаны схематически, по фотографиям УТЦ.
    const trackW=w*.963,trackH=h*.915,laneWidth=3.2;
    re(-trackW/2,-trackH/2,trackW,trackH,{rx:trackH/2,fill:"#7b95a7",stroke:"#667d8c","stroke-width":1.5});
    const infieldW=trackW-12*laneWidth,infieldH=trackH-12*laneWidth;
    re(-infieldW/2,-infieldH/2,infieldW,infieldH,{rx:infieldH/2,fill:"#b1be9e",stroke:"none"});
    for(let lane=0;lane<=6;lane++){
      const inset=lane*laneWidth,ww=trackW-2*inset,hh=trackH-2*inset;
      re(-ww/2,-hh/2,ww,hh,{rx:hh/2,stroke:"#fbf9f2","stroke-width":lane===0||lane===6?1.2:.94});
    }
    const grassW=w*.553,grassH=h*.527;
    re(-grassW/2,-grassH/2,grassW,grassH,{fill:"#9caf8c",stroke:"#c8d3ba","stroke-width":.85});
    for(let band=0;band<10;band+=2){
      re(-grassW/2+grassW*band/10,-grassH/2,grassW/10,grassH,{fill:"#aabb9b",stroke:"none"});
    }
    const lineY=-trackH/2;
    ln(-w*.204,lineY,-w*.204,lineY+6*laneWidth,"#fffdf8",1.5);
    for(let lane=0;lane<6;lane++){
      const y=lineY+lane*laneWidth;
      const x=w*.18+lane*2.25;
      ln(x,y,x,y+laneWidth,"#fffdf8",1.15);
    }
    re(-w*.306,-h*.145,11,8,{rx:1,fill:"#ad7a6d",stroke:"#e7e9de","stroke-width":.8});
    re(w*.193,-h*.322,17,8,{rx:1,fill:"#728999",stroke:"#dbe4e5","stroke-width":.75});
    return;
  }
  if(id===15){
    // Quiet turf texture; avoid assuming fixed throwing sectors.
    for(let k=-3;k<=3;k++)ln(-.44*w,k*h*.105,.44*w,k*h*.105,"#cdd0c3",.6);
    return;
  }
  if(id===16){
    const W=w*.915,H=h*.865,line={stroke:"#fff9f0","stroke-width":1.12};
    re(-W/2,-H/2,W,H,{fill:"#7793a8",stroke:"none"});
    for(const sign of [-1,1]){
      const end=sign*W/2,inside=end-sign*W*.204,depth=H*.173;
      re(Math.min(end,inside),-depth,Math.abs(end-inside),2*depth,{fill:"#b98172",...line});
      const tip=sign*W*.23;
      path("M"+end+" "+(-H*.41)+"Q"+tip+" "+(-H*.42)+" "+tip+" 0T"+end+" "+H*.41,line);
      const backboard=end-sign*W*.044;
      ln(backboard,-H*.12,backboard,H*.12,"#fffdf8",1.55);
      oval(backboard-sign*W*.035,0,1.15,1.15,{stroke:"#f9f0dd","stroke-width":.7});
    }
    re(-W/2,-H/2,W,H,line);
    ln(0,-H/2,0,H/2,line.stroke,1.1);
    oval(0,0,H*.122,H*.122,{fill:"#b98172",...line});
    return;
  }
  if(id===2){
    if(p.roofStyle==="hospitality-south"){
      draw("polygon",{points:"741,322 753,324 747,353 735,351",fill:"#513a31",stroke:"none","fill-opacity":.18},base);
      ln(753,324,747,353,"#62463e",.95,base);
      rib(-.46,.46,5,"long");
    }else{
      path("M755 276L778 280L770 318L747 314Z",{stroke:"#777d77","stroke-width":.85},base);
    }
    return;
  }
  if([1,4,5,6,7,17,18,19,20,21,22,23].includes(id)){
    const count=id===23?22:id===22?18:id===17?14:id===6?5:Math.max(3,Math.round(w/12));
    rib(-.48,.48,count);
    if([1,4,5,17,19,20,22,23].includes(id)){
      // Long standing-seam sheets meet at a shallow central ridge.
      rectAt(-.48,.02,.96,.40,{fill:"#777b76",opacity:.09,stroke:"none"});
      ln(-.48*w,0,.48*w,0,id===22||id===23?light:ink,.82);
      ln(-.44*w,h*.40,.44*w,h*.40,light,.7);
    }
    if(id===18){vent(-.26,-.12);vent(.02,-.12);vent(.29,-.12);}
    if(id===22||id===23){
      // Metal roof sheets, narrower edge flashing and paired rooftop units on the arena.
      for (const edge of [-.43,.43]) {
        ln(-w*.46,h*edge,w*.46,h*edge,"#fcf9ef",.6);
      }
      if(id===23){vent(-.12,-.18,1.2);vent(.1,-.18,1.15);}
    }
    if(id===7 || id===21)vent(.22,0,.8);
    parapet();return;
  }
  if(id===12){
    // Barrel roof: narrower panel strips at the eaves describe the curved section.
    for(const [s,sw] of [[-.46,1],[-.40,.8],[-.31,.8],[-.18,.7],[0,.75],[.18,.7],[.31,.8],[.40,.8],[.46,1]]){
      ln(-w*.49,h*s,w*.49,h*s,Math.abs(s)>.35?light:pale,sw);
    }
    for(let j=-4;j<=4;j++){
      const x=w*j/10;
      path("M"+x+" "+(-h*.48)+" Q"+(x+2.7)+" 0 "+x+" "+h*.48,{stroke:light,"stroke-width":.72});
    }
    parapet();return;
  }
  if(id===9 || id===10){
    const drawRect=(x,y,w,h,a)=>re(x,y,w,h,{fill:"#e9e9e2",stroke:light,"stroke-width":1,transform:"rotate(12 "+x+" "+y+")",...a},base);
    if(p.roofStyle==="hotel-north"){
      drawRect(1086,191,56,58);drawRect(1093,198,40,42,{fill:"#d0d2ca"});
      drawRect(1144,214,9,31);
    }else if(id===9){
      for(let y=293;y<390;y+=9) ln(1136-(y-293)*.25,y,1120-(y-293)*.25,y-4,"#a5a99f",.54,base);
      drawRect(1114,338,8,26);
    }else{
      for(let x=972;x<1078;x+=5)ln(x,270,x-34,426,"#a7aa9f",.55,base);
      // Circular glazed roof of the hotel atrium.
      oval(1006,293,18.5,17.5,{fill:"#a8c0c3",stroke:"#f0f1e6","stroke-width":1.1},base);
      for(const t of [.28,.6,.84])oval(1006,293,18*t,17*t,{stroke:"#d7e4de","stroke-width":.42},base);
      for(let i=0;i<12;i++){
        const a=i*Math.PI/6;
        ln(1006,293,1006+Math.cos(a)*18,293+Math.sin(a)*17,"#d2e1da",.45,base);
      }
      drawRect(1011,357,46,35);drawRect(1056,306,19,10);drawRect(1044,323,12,7);
    }
    parapet();return;
  }
  if(id===3){rib(-.4,.4,3);parapet();}
}

function buildFacade(place, edge, svg, container) {
  const layer=svg("g",{"pointer-events":"none"},container);
  const [a,b]=edge;
  const length=Math.hypot(b[0]-a[0],b[1]-a[1]);
  const hotel=[1,9,10,21].includes(place.id);
  const longHall=[12,17,22,23].includes(place.id);
  const columns=Math.max(1,Math.min(19,Math.round(length/(hotel?9:longHall?16:11))));
  const rows=place.roofStyle==="hotel-north"?1:hotel?(place.id===21?3:4):[2,3,6,7,18].includes(place.id)?1:2;
  const base=svg("rect",{x:0,y:0,width:1,height:1,stroke:"#696970","stroke-width":.85,"vector-effect":"non-scaling-stroke"},layer);
  const trim=svg("g",{"stroke-width":.022},layer);
  svg("path",{d:"M0 .08H1 M0 .91H1",fill:"none","stroke-width":.033},trim);
  if(place.id===23&&length>27){
    // Со стороны улицы у большой арены тянется горизонтальный пояс остекления.
    svg("rect",{x:.05,y:.49,width:.90,height:.31,fill:"#849c9f","fill-opacity":.96,stroke:"none"},trim);
    let mullions="";
    for(let i=1;i<columns;i++)mullions+=`M${i/columns} .49V.80 `;
    svg("path",{d:mullions,fill:"none",stroke:"#f5f4ef","stroke-opacity":.58,"stroke-width":.009},trim);
  }else if(length>13&&place.id!==0){
    let windows="",sills="";
    for(let row=0;row<rows;row++){
      const y=.16+row*(.67/rows),height=.40/rows;
      for(let col=0;col<columns;col++){
        const x=(col+.2)/columns,width=(longHall?.66:.47)/columns;
        windows+=`M${x} ${y}h${width}v${height}h${-width}Z `;
        if(hotel)sills+=`M${x-.06/columns} ${y+height+.022}h${width+.12/columns} `;
      }
    }
    if(rows>1)for(let i=1;i<rows;i++)sills+=`M0 ${.13+.67/rows*i}H1 `;
    svg("path",{d:windows,fill:"#737e80","fill-opacity":longHall?.8:.96,stroke:"none"},trim);
    if(sills)svg("path",{d:sills,fill:"none","stroke-width":.022},trim);
    // Тонкие рёбра длинных стен спортивных манежей.
    if(longHall){
      let ribs="";
      for(let i=1;i<columns;i++)ribs+=`M${i/columns} .08V.91 `;
      svg("path",{d:ribs,stroke:"#64646c","stroke-opacity":.24,"stroke-width":.58,"vector-effect":"non-scaling-stroke",fill:"none"},layer);
    }
  }
  return {layer,base,trim};
}
function paintFacades(o, m, active, project) {
  const {p,faces,winding}=o;
  const height=p.height*m.height;
  o.sides.setAttribute("visibility",height>.4?"visible":"hidden");
  if(height<=.4)return;
  faces.forEach((face,i)=>{
    const a=project(p.footprint[i],m),b=project(p.footprint[(i+1)%p.footprint.length],m);
    const dx=b[0]-a[0],dy=b[1]-a[1], visible=dx*winding<-.4;
    face.layer.setAttribute("visibility",visible?"visible":"hidden");
    if(!visible)return;
    face.layer.setAttribute("transform",`matrix(${dx} ${dy} 0 ${height} ${a[0]} ${a[1]-height})`);
    const light=Math.abs(dx)/Math.hypot(dx,dy)>.64;
    const material=active?'active':o.key?'venue':'neighbour';
    face.base.setAttribute("fill",`url(#ng-wall-${material}-${light?'lit':'shade'})`);
    face.base.setAttribute("stroke",active?"#97744d":"#a5a397");
    face.trim.setAttribute("stroke",active?"#edc797":o.key?"#d2c2aa":"#c1c3b9");
  });
}


function createGuestMap({scene, zoomIn, zoomOut, onSelect, onReset, initialSelection}) {
  const NS = 'http://www.w3.org/2000/svg';
  function make(tag, attrs = {}, parent) {
    const el = document.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
    if (parent) parent.append(el);
    return el;
  }
  scene.setAttribute('tabindex', '0');
  scene.setAttribute('role', 'group');
  scene.setAttribute('aria-label', 'Карта дня заезда. Выберите здание. Клавиши плюс и минус меняют масштаб, стрелки передвигают карту, Home возвращает к обзору.');
  scene.style.touchAction = 'pan-y';
  scene.style.userSelect = 'none';
  const materials = make('defs',{},scene);
  function gradient(id, colours, horizontal=false) {
    const paint = make('linearGradient',{id, x1:'0%', y1:'0%', x2:horizontal?'100%':'15%', y2:'100%'},materials);
    colours.forEach(([offset,colour])=>make('stop',{offset,'stop-color':colour},paint));
  }
  gradient('ng-roof-hotel',[['0%','#f6e9ce'],['52%','#f0e2c9'],['100%','#dac9ae']],true);
  gradient('ng-roof-ice',[['0%','#f2e9d7'],['48%','#e4ded0'],['100%','#cccdbf']],true);
  gradient('ng-roof-active',[['0%','#f2d3a4'],['50%','#e7bc83'],['100%','#d5aa72']],true);
  gradient('ng-roof-neighbour',[['0%','#f8f8f4'],['100%','#dfdfd7']],true);
  for(const [tag,top,bottom] of [
    ['neighbour-lit','#ebebe5','#d3d3cb'],['neighbour-shade','#dbdbd4','#bbbbb2'],
    ['venue-lit','#eedec5','#d1c3af'],['venue-shade','#dfd3bf','#c4b7a4'],
    ['active-lit','#e9c69c','#c6a27b'],['active-shade','#ceac85','#b6926e']
  ]) gradient('ng-wall-'+tag,[['0%',top],['100%',bottom]]);

  const buildings = {
    sok2: {name:'СОК 2', anchor:[1123,324], height:17, labelOffset:[35,-24], ids:[9]},
    sok3: {name:'СОК 3', entry:[991,278], towards:[1005,293], anchor:[1007,347], height:16, labelOffset:[-32,-15], ids:[10]},
    winter: {name:'Центр зимних видов спорта', entry:[1293,658], towards:[1271,652], anchor:[1172,661], height:7, labelOffset:[0,34], ids:[22,23,0]}
  };
  // The published plan identifies exterior footprints; indoor activities share their building.
  const keyForId = new Map(Object.entries(buildings).flatMap(([key, b]) => b.ids.map(id => [id,key])));
  const yaw = -25 * Math.PI / 180, pitch = 42 * Math.PI / 180;
  const m = {a:Math.cos(yaw), b:Math.sin(yaw)*Math.cos(pitch), c:-Math.sin(yaw),
    d:Math.cos(yaw)*Math.cos(pitch), e:0, f:0, height:Math.sin(pitch)*1.3};
  function project([x,y], matrix, h=0) {
    return [matrix.a*x+matrix.c*y, matrix.b*x+matrix.d*y-h*matrix.height];
  }
  const transform = (h=0) => 'matrix('+[m.a,m.b,m.c,m.d,0,-h*m.height].join(' ')+')';
  const points = poly => poly.map(point => point.join(',')).join(' ');
  const world = make('g', {'aria-hidden':'true'}, scene);
  const ground = make('g', {transform:transform(),'pointer-events':'none'}, world);
  make('image',{x:100,y:-160,width:1500,height:1140,href:'assets/map-grounds.svg',preserveAspectRatio:'none'},ground);
  const shade = make('g', {'pointer-events':'none'}, world);
  const solids = make('g', {}, world);
  const contextLabels = make('g', {'aria-hidden':'true', 'pointer-events':'none'}, scene);
  const labels = make('g', {}, scene);
  const entranceLayer = make('g', {'pointer-events':'none','aria-hidden':'true',class:'venue-entry-pin'}, scene);
  // Кончик стрелки совпадает с точкой входа, а размер остаётся постоянным при зуме.
  make('path',{class:'venue-entry-arrow',d:'M0 0 -10 -8 -10 -3 -22 -3 -22 3 -10 3 -10 8Z'},entranceLayer);
  const parts = [WINTER_LINK, ...PLACES.filter(p => p.id!==24).flatMap(p =>
    [p,...(p.annexes||[]).map(annex => ({...annex,id:p.id,marker:annex.marker || p.marker,annex:true}))])];
  parts.sort((a,b) => Number(Boolean(a.height))-Number(Boolean(b.height)) ||
    Number(a.id!==0)-Number(b.id!==0) || project(a.marker,m)[1]-project(b.marker,m)[1]);
  const shapes = [], byKey = new Map(), paths = new Map(), pins = new Map();
  for (const part of parts) {
    const key = keyForId.get(part.id);
    const visiblePart = make('g', key ? {'data-map-building':key} : {'pointer-events':'none',opacity:'.87'}, solids);
    if (key) visiblePart.style.cursor='pointer';
    const sides = make('g', {}, visiblePart);
    const faces = part.footprint.map((a,i) => part.height ?
      buildFacade(part, [a,part.footprint[(i+1)%part.footprint.length]], make, sides) : null);
    const winding = Math.sign(part.footprint.reduce((area,a,i) => {
      const b=part.footprint[(i+1)%part.footprint.length]; return area+a[0]*b[1]-a[1]*b[0];
    },0));
    if (part.height) {
      const offset=part.height*m.height*.62;
      make('polygon',{points:points(part.footprint.map(v => {
        const [x,y]=project(v,m);return [x+offset,y+offset*.5];
      })),fill:'#797869',opacity:key?'.25':'.16'},shade);
    }
    const deck = make('g',{transform:transform(part.height)},visiblePart);
    const roof = make('polygon',{points:points(part.footprint),'stroke-linejoin':'round'},deck);
    if (!part.annex || part.roofStyle || part.id===0) buildArchitecture(part, make('g',{'pointer-events':'none'},deck),make);
    const item={p:part,sides,faces,winding,roof,key};
    shapes.push(item);
    if (key) {
      const verts=paths.get(key)||[];
      part.footprint.forEach(pt => verts.push(project(pt,m,part.height),project(pt,m)));
      paths.set(key,verts);
      visiblePart.addEventListener('click', () => {if(!skipClick) notifySelect(key)});
    }
  }
  function bounds(vertices) {
    const xs=vertices.map(p=>p[0]), ys=vertices.map(p=>p[1]);
    return [Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)];
  }
  function addMapPill(group, name, width, height) {
    const bg = make('rect', {class:'map-pill-bg', x:-width/2, y:-height/2, width, height, rx:height/2}, group);
    const text = make('text', {class:'map-pill-text', x:0, y:0, dy:'.35em', 'text-anchor':'middle', 'pointer-events':'none'}, group);
    text.textContent = name;
    return {text, bg, w:width};
  }
  // Landmarks give context without taking priority over the three navigable venues.
  const context = [
    {name:'Ледовый манеж',point:[994,484],height:10,width:128},
    {name:'Футбольное поле',point:[846,466],height:0,width:138}
  ].map(place => {
    const el = make('g', {class:'map-context-pill'}, contextLabels);
    return {el, point:project(place.point,m,place.height), ...addMapPill(el, place.name, place.width, 28)};
  });
  const overview=bounds([...paths.values()].flat());
  for(const [key, vertices] of paths) byKey.set(key,bounds(vertices));
  for(const [key,b] of Object.entries(buildings)) {
    const control=make('g', {'data-map-label':key,role:'button',tabindex:0,'aria-label':b.name,'aria-pressed':'false'}, labels);
    const w = key === 'winter' ? 208 : 60;
    const hit = make('rect', {x:-w/2-1,y:-22,width:w+2,height:44,rx:22,fill:'transparent'}, control);
    const pill = addMapPill(control, b.name, w, 32);
    control.addEventListener('click', () => {if(!skipClick) notifySelect(key)});
    control.addEventListener('keydown', e => {if (e.key==='Enter'||e.key===' ') {e.preventDefault();notifySelect(key)}});
    pins.set(key,{...pill,control,hit,anchor:project(b.anchor,m,b.height),offset:b.labelOffset});
  }
  let width=0,height=0,scale=1,cx=0,cy=0,minScale=1,selection=initialSelection,manual=false,skipClick=false;
  let cameraFrame=0;
  let cameraTarget=null;
  let rankedPins=[];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const touchPointer = window.matchMedia('(pointer: coarse)');
  function stopCamera(){cancelAnimationFrame(cameraFrame);cameraFrame=0;}
  const clamp=(value,min,max)=>Math.max(min,Math.min(value,max));
  const worldAt=([x,y])=>[(x-width/2)/scale+cx,(y-height/2)/scale+cy];
  const screenAt=([x,y])=>[(x-cx)*scale+width/2,(y-cy)*scale+height/2];
  function fitScale([x0,y0,x1,y1], marginX, marginY) {
    return Math.max(.08,Math.min((width-2*marginX)/(x1-x0),(height-2*marginY)/(y1-y0)));
  }
  function fit() {
    const box=cameraTarget?byKey.get(cameraTarget):overview;
    cx=(box[0]+box[2])/2;cy=(box[1]+box[3])/2;
    // Leave the entrance and neighbouring buildings visible, including on narrower side-by-side layouts.
    scale=cameraTarget?clamp(fitScale(box,Math.max(42,width*.16),Math.max(48,height*.18)),minScale,minScale*2.9):minScale;
    manual=false;
  }
  function updateBuildings() {
    for(const o of shapes){
      const active=!!o.key&&o.key===selection;
      if(o.active===active)continue;
      o.active=active;
      const material=active?'active':o.key==='winter'?'ice':o.key?'hotel':'neighbour';
      o.roof.setAttribute('fill',o.p.height?`url(#ng-roof-${material})`:(o.p.roofColor||'#e6e7dd'));
      o.roof.setAttribute('stroke',active?'#8b633d':o.key?'#a28d71':'#a9aaa0');
      o.roof.setAttribute('stroke-width',o.key?1.55:.8);
      paintFacades(o,m,active,project);
    }
    for(const [key,{control}] of pins) {
      control.setAttribute('aria-pressed',String(key===selection));
    }
    rankedPins=[...pins.entries()].sort(([a],[b])=>Number(b===selection)-Number(a===selection));
  }
  function draw() {
    world.setAttribute('transform','translate('+width/2+' '+height/2+') scale('+scale+') translate('+(-cx)+' '+(-cy)+')');
    const positions=[];
    const place=buildings[selection];
    entranceLayer.style.display=place?.entry?'':'none';
    if(place?.entry){
      const [x,y]=screenAt(project(place.entry,m));
      const [tx,ty]=screenAt(project(place.towards,m));
      const direction=Math.atan2(ty-y,tx-x);
      entranceLayer.setAttribute('transform',`translate(${x} ${y}) rotate(${direction*180/Math.PI})`);
      positions.push({x:x-11*Math.cos(direction),y:y-11*Math.sin(direction),w:26});
    }
    for(const [,pin] of rankedPins){
      const [ax,ay]=screenAt(pin.anchor);
      const inFrame=ax>=0&&ax<=width&&ay>=0&&ay<=height;
      pin.control.setAttribute('visibility',inFrame?'visible':'hidden');
      if(!inFrame)continue;
      const x=clamp(ax+pin.offset[0],pin.w/2+6,width-pin.w/2-6);
      const desiredY=ay+pin.offset[1];
      let y=clamp(desiredY,23,height-23);
      for(const dy of [0,-46,46,-92,92]){
        const tryY=clamp(desiredY+dy,23,height-23);
        if(positions.every(other=>Math.abs(other.x-x)>(other.w+pin.w)/2+6||Math.abs(other.y-tryY)>=45)){
          y=tryY;break;
        }
      }
      positions.push({x,y,w:pin.w});
      pin.control.setAttribute('transform','translate('+x+' '+y+')');
    }
    for(const item of context){
      const [x,y]=screenAt(item.point);
      const visible=width>520 && x>item.w/2+16 && x+item.w/2<width-16 && y>40 && y<height-34
        && positions.every(p=>Math.abs(x-p.x)>(item.w+p.w)/2+8 || Math.abs(y-p.y)>37);
      item.el.setAttribute('visibility',visible?'visible':'hidden');
      if(visible) {
        item.el.setAttribute('transform',`translate(${x} ${y})`);
        positions.push({x,y,w:item.w});
      }
    }
    if(zoomIn)zoomIn.disabled=scale>=minScale*4-.001;
    if(zoomOut)zoomOut.disabled=scale<=minScale+.001;
    scene.style.cursor=pointers.size&&wasDragged?'grabbing':scale>minScale+.001?'grab':'default';
  }
  function resize() {
    const w=scene.clientWidth,h=scene.clientHeight;
    if(!w||!h||(w===width&&h===height))return;
    stopCamera();
    const relativeZoom=scale/minScale;
    width=w;height=h;
    scene.setAttribute('viewBox','0 0 '+width+' '+height);
    minScale=fitScale(overview,Math.min(38,w*.09),Math.min(46,h*.105));
    if(manual)scale=clamp(relativeZoom,1,4)*minScale;
    else fit();
    draw();
  }
  function focus(key) {
    if(!byKey.has(key))return;
    moveCamera(key);
  }
  function notifySelect(key) {focus(key);if(onSelect)onSelect(key)}
  function moveCamera(key){
    stopCamera();
    const start={cx,cy,scale};
    selection=key;cameraTarget=key;fit();updateBuildings();
    const end={cx,cy,scale};
    if(motion.matches || !width){draw();return;}
    const duration=touchPointer.matches?320:530;
    const started=performance.now();
    function frame(now){
      const pct=clamp((now-started)/duration,0,1), t=1-Math.pow(1-pct,3);
      cx=start.cx+(end.cx-start.cx)*t;cy=start.cy+(end.cy-start.cy)*t;
      scale=start.scale+(end.scale-start.scale)*t;draw();
      if(pct<1)cameraFrame=requestAnimationFrame(frame);
    }
    frame(started);
  }
  function reset(){moveCamera(null)}
  function constrain(){
    // Bound panning to the guest area, keeping at least one part of that area reachable.
    cx=clamp(cx,overview[0],overview[2]);cy=clamp(cy,overview[1],overview[3]);
  }
  function scaleAt(next,point){
    stopCamera();
    const origin=worldAt(point);
    scale=clamp(next,minScale,minScale*4);
    cx=origin[0]-(point[0]-width/2)/scale;
    cy=origin[1]-(point[1]-height/2)/scale;
    manual=true;constrain();draw();
  }
  function zoom(step){
    stopCamera();
    const level=clamp(scale*Math.pow(1.45,step),minScale,minScale*4);
    if(level<=minScale+.001){cx=(overview[0]+overview[2])/2;cy=(overview[1]+overview[3])/2;scale=minScale;manual=true;draw();}
    else scaleAt(level,[width/2,height/2]);
  }
  zoomIn?.addEventListener('click',()=>zoom(1));
  zoomOut?.addEventListener('click',()=>zoom(-1));
  scene.addEventListener('keydown',e=>{
    const steps={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
    if(steps[e.key]){
      e.preventDefault();stopCamera();const [x,y]=steps[e.key];cx+=x*56/scale;cy+=y*56/scale;manual=true;constrain();draw();
    }else if(['+','=','-','_'].includes(e.key)){
      e.preventDefault();zoom(e.key==='-'||e.key==='_'?-1:1);
    }else if(e.key==='Home'||e.key==='Escape'){
      e.preventDefault();reset();if(onReset)onReset();
    }
  });
  const pointers=new Map();
  let gesture=null,wasDragged=false,suppressTimer,dragFrame=0;
  const local=e=>{const r=scene.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
  function measure(){
    const pts=[...pointers.values()].slice(0,2);
    const [a,b]=pts;
    return {point:b?[(a[0]+b[0])/2,(a[1]+b[1])/2]:a,distance:b?Math.hypot(a[0]-b[0],a[1]-b[1]):0};
  }
  function beginGesture(){
    stopCamera();
    if(!pointers.size){gesture=null;return}
    const {point,distance}=measure();
    gesture={point,distance,scale,origin:worldAt(point)};
  }
  // Leave single-finger vertical swipes to the page. Two fingers operate the map.
  scene.addEventListener('touchstart',event=>{
    if(event.touches.length===2 && event.cancelable)event.preventDefault();
  },{passive:false});
  scene.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;
    if(!pointers.size){wasDragged=false;skipClick=false;clearTimeout(suppressTimer);}
    pointers.set(e.pointerId,local(e));
    if(pointers.size>1){wasDragged=true;skipClick=true;}
    beginGesture();
  });
  scene.addEventListener('pointermove',e=>{
    if(!pointers.has(e.pointerId)||!gesture)return;
    pointers.set(e.pointerId,local(e));
    const {point,distance}=measure();
    const dx=point[0]-gesture.point[0],dy=point[1]-gesture.point[1];
    if(!wasDragged){
      if(e.pointerType==='touch' && pointers.size===1 && Math.abs(dy)>Math.abs(dx))return;
      if(Math.hypot(dx,dy)<5)return;
    }
    wasDragged=true;skipClick=true;manual=true;
    if(!scene.hasPointerCapture(e.pointerId))scene.setPointerCapture(e.pointerId);
    scale=gesture.distance?clamp(gesture.scale*distance/gesture.distance,minScale,minScale*4):gesture.scale;
    cx=gesture.origin[0]-(point[0]-width/2)/scale;cy=gesture.origin[1]-(point[1]-height/2)/scale;
    constrain();
    if(!dragFrame)dragFrame=requestAnimationFrame(()=>{
      dragFrame=0;
      draw();
    });
  });
  function lift(e){
    if(!pointers.delete(e.pointerId))return;
    beginGesture();
    if(!pointers.size&&wasDragged){
      cancelAnimationFrame(dragFrame);dragFrame=0;
      suppressTimer=setTimeout(()=>{skipClick=false},0);
      draw();
    }
  }
  scene.addEventListener('pointerup',lift);scene.addEventListener('pointercancel',lift);
  scene.addEventListener('pointerleave',e=>{if(!scene.hasPointerCapture(e.pointerId))lift(e)});
  scene.addEventListener('wheel',e=>{
    if(!e.ctrlKey&&!e.metaKey)return;
    e.preventDefault();scaleAt(scale*Math.exp(-e.deltaY*.008),local(e));
  },{passive:false});
  function measurePills() {
    for (const pill of [...pins.values(), ...context]) {
      const textWidth = pill.text.getComputedTextLength?.();
      if (!textWidth) continue;
      pill.w = Math.ceil(textWidth) + 20;
      pill.bg.setAttribute('width', pill.w);
      pill.bg.setAttribute('x', -pill.w/2);
      if (pill.hit) {
        pill.hit.setAttribute('width', pill.w + 2);
        pill.hit.setAttribute('x', -pill.w/2 - 1);
      }
    }
    draw();
  }
  updateBuildings();resize();new ResizeObserver(resize).observe(scene);
  document.fonts?.ready.then(measurePills);
  return {focus,reset,zoom,isFocused:key => cameraTarget===key};
}

const hotelPage = 'https://novogorsksport.ru/prozhivanie/nomernoj-fond/';
const icePage = 'https://novogorsksport.ru/sportsoourzheniya/ledovye-areny/';
const venues = {
  sok2: {
    photos: [
      ['venue-sok2', 'Фасад со стороны пруда', hotelPage],
      ['venue-hall-main', 'Конференц-зал с амфитеатром', 'https://novogorsksport.ru/sportsoourzheniya/konferenc-zal/'],
      ['venue-cafe', 'Спортбар в СОК 2', 'https://novogorsksport.ru/tochki_pitaniya/sok-2-atrium-2-ehtazha/']
    ]
  },
  winter: {
    photos: [
      ['venue-winter-facade', 'Фасад Центра зимних видов спорта', hotelPage],
      ['venue-ice-panorama', 'Большая ледовая арена', icePage],
      ['venue-ice-stands', 'Большая арена и зрительские трибуны', icePage]
    ]
  },
  sok3: {
    photos: [
      ['venue-sok3', 'Вход под круглым козырьком', hotelPage],
      ['venue-sok3-lobby', 'Лобби-бар на втором этаже СОК 3', 'https://novogorsksport.ru/tochki_pitaniya/sok-4-obedennyj-zal/'],
      ['venue-sok3-room', 'Номер категории «Стандарт» в СОК 3', hotelPage]
    ]
  }
};
const section = document.getElementById('venue');
const scene = document.getElementById('venue-scene');
const reset = document.getElementById('venue-reset');
const controls = Array.from(section.querySelectorAll('.venue-card-trigger'));
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const galleries = new Map();
let activeVenue = null;

function selectPhoto(key, proposed) {
  const {photos} = venues[key];
  const gallery = galleries.get(key);
  const index = (proposed + photos.length) % photos.length;
  const [file, caption, source] = photos[index];
  gallery.index = index;
  gallery.img.src = 'assets/' + file + '.webp';
  gallery.img.alt = caption;
  gallery.status.textContent = `Фотография ${index + 1} из ${photos.length}. ${caption}`;
  gallery.credit.href = source;
  gallery.credit.title = file === 'venue-ice-panorama' ? 'Источник фото: Олег Наумов / УТЦ «Новогорск»' : 'Источник фото: УТЦ «Новогорск»';
  gallery.credit.setAttribute('aria-label', gallery.credit.title);
  gallery.dots.forEach((dot, i) => {
    if (i === index) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });
}
function step(key, direction) {
  selectPhoto(key, galleries.get(key).index + direction);
}
function enableSwipe(surface, key) {
  let start;
  let lastSwipe = 0;
  surface.addEventListener('touchstart', event => {
    if (event.touches.length !== 1) { start = null; return; }
    const finger = event.touches[0];
    start = [finger.clientX, finger.clientY];
  }, {passive:true});
  surface.addEventListener('touchcancel', () => { start = null; });
  surface.addEventListener('touchend', event => {
    if (!start) return;
    const end = event.changedTouches[0];
    const dx = end.clientX - start[0];
    const dy = end.clientY - start[1];
    start = null;
    if (Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    lastSwipe = performance.now();
    step(key, dx < 0 ? 1 : -1);
  }, {passive:true});
  surface.addEventListener('click', event => {
    if (lastSwipe > 0 && performance.now() - lastSwipe < 350) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
}
for (const trigger of controls) {
  const key = trigger.dataset.venue;
  const region = document.getElementById(trigger.getAttribute('aria-controls'));
  region.innerHTML = '<div class="venue-gallery-view"><img class="venue-photo" alt="" loading="lazy" decoding="async" draggable="false">' +
    '<a class="venue-photo-source" target="_blank" rel="noopener" aria-label="Источник фотографии">' +
    '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6m0-6-10 10"/><path d="M10 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-4"/></svg></a>' +
    '<button type="button" class="venue-image-step venue-prev" data-step="-1" aria-label="Предыдущая фотография"><img src="assets/gallery-prev.svg" width="24" height="24" alt=""></button>' +
    '<button type="button" class="venue-image-step venue-next" data-step="1" aria-label="Следующая фотография"><img src="assets/gallery-next.svg" width="24" height="24" alt=""></button>' +
    '<div class="venue-dots"></div></div><span class="venue-photo-status" role="status"></span>';
  const dots = venues[key].photos.map((photo, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'venue-dot';
    dot.setAttribute('aria-label', 'Фотография ' + (index + 1) + '. ' + photo[1]);
    dot.addEventListener('click', () => selectPhoto(key, index));
    region.querySelector('.venue-dots').append(dot);
    return dot;
  });
  galleries.set(key, {index:0, region, trigger, dots,
    img:region.querySelector('.venue-photo'), credit:region.querySelector('.venue-photo-source'),
    status:region.querySelector('.venue-photo-status')});
  region.querySelectorAll('[data-step]').forEach(button => {
    button.addEventListener('click', () => step(key, Number(button.dataset.step)));
  });
  region.addEventListener('keydown', event => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    step(key, event.key === 'ArrowRight' ? 1 : -1);
  });
  enableSwipe(region.querySelector('.venue-gallery-view'), key);
}

function renderVenue(key) {
  activeVenue = key || null;
  reset.hidden = !activeVenue;
  galleries.forEach((gallery, id) => {
    const open = id === activeVenue;
    gallery.region.hidden = !open;
    gallery.trigger.closest('article').classList.toggle('is-open', open);
    gallery.trigger.setAttribute('aria-expanded', String(open));
    if (open) selectPhoto(id, gallery.index);
  });
}
const firstVenue = controls[0].dataset.venue;
let guestMap;
let mapObserver;
function ensureGuestMap() {
  if (guestMap) return guestMap;
  mapObserver?.disconnect();
  guestMap = createGuestMap({
    scene, initialSelection:activeVenue,
    zoomIn:document.getElementById('venue-zoom-in'),
    zoomOut:document.getElementById('venue-zoom-out'),
    onSelect:renderVenue, onReset:() => renderVenue(null)
  });
  return guestMap;
}
renderVenue(firstVenue);
if ('IntersectionObserver' in window) {
  mapObserver = new IntersectionObserver(observations => {
    if (observations.some(observation => observation.isIntersecting)) ensureGuestMap();
  }, {rootMargin:'700px 0px'});
  mapObserver.observe(scene);
} else {
  ensureGuestMap();
}
function openVenue(key) {
  if (!venues[key]) return;
  renderVenue(key);
  ensureGuestMap().focus(key);
}
function clearSelection() {
  ensureGuestMap().reset();
  renderVenue(null);
}
reset.addEventListener('click', () => { clearSelection(); scene.focus({preventScroll:true}); });
controls.forEach(trigger => trigger.addEventListener('click', () => {
  const key = trigger.dataset.venue;
  if (key === activeVenue && guestMap?.isFocused(key)) {
    clearSelection();
    return;
  }
  openVenue(key);
  if (matchMedia('(max-width: 820px)').matches && scene.getBoundingClientRect().bottom < scene.clientHeight / 2) {
    section.scrollIntoView({block:'start',behavior:prefersReducedMotion.matches ? 'instant' : 'smooth'});
  }
}));

document.addEventListener('keydown', event => {
  if (event.key === 'Tab' || event.key.startsWith('Arrow')) section.classList.add('keyboard-nav');
});
document.addEventListener('pointerdown', () => section.classList.remove('keyboard-nav'), true);
function followVenueHash(hash) {
  const key = hash.startsWith('#venue-') ? hash.slice(7) : '';
  if (!venues[key]) return;
  openVenue(key);
  section.scrollIntoView({block:'start',behavior:prefersReducedMotion.matches ? 'instant' : 'smooth'});
}
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#venue-"]');
  if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const hash = link.getAttribute('href');
  if (!venues[hash.slice(7)]) return;
  event.preventDefault();
  if (location.hash !== hash) history.pushState(null,'',hash);
  followVenueHash(hash);
  scene.focus({preventScroll:true});
});
window.addEventListener('hashchange', () => followVenueHash(location.hash));
if (location.hash.startsWith('#venue-')) requestAnimationFrame(() => followVenueHash(location.hash));

})();
