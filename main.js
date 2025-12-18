/* ===== AUTO LOGIN ===== */
if(localStorage.getItem("currentUser") && location.pathname.includes("index")){
  location.href="dashboard.html";
}

/* ===== REGISTER ===== */
function register(){
  if(localStorage.getItem("deviceRegistered")){
    alert("هذا الجهاز مسجل بالفعل");
    return;
  }

  if(!user.value || !pass.value){
    alert("املأ البيانات");
    return;
  }

  let users=JSON.parse(localStorage.getItem("users")||"[]");

  users.push({
    username:user.value,
    password:pass.value,
    date:new Date().toLocaleString()
  });

  localStorage.setItem("users",JSON.stringify(users));
  localStorage.setItem("currentUser",user.value);
  localStorage.setItem("deviceRegistered","yes");

  location.href="dashboard.html";
}

/* ===== LOGIN ===== */
function login(){
  let users=JSON.parse(localStorage.getItem("users")||"[]");
  let found=users.find(u=>u.username===user.value && u.password===pass.value);

  if(found){
    localStorage.setItem("currentUser",found.username);
    location.href="dashboard.html";
  }else alert("بيانات غير صحيحة");
}

/* ===== SERVICES ===== */
let services=JSON.parse(localStorage.getItem("services"))||{
  followers:100,
  views:2000,
  likes:500,
  favorites:300
};
localStorage.setItem("services",JSON.stringify(services));

/* ===== ORDER ===== */
function makeOrder(){
  let service=serviceSel.value;
  let qty=Number(quantity.value);
  let link=serviceLink.value;

  if(qty>services[service]){
    alert("الكمية أكبر من المسموح");
    return;
  }

  if(!link.includes("tiktok.com")){
    alert("رابط تيك توك غير صحيح");
    return;
  }

  let orders=JSON.parse(localStorage.getItem("orders")||"[]");
  let user=localStorage.getItem("currentUser");

  let last=orders.find(o=>o.user===user && o.service===service);
  if(last && Date.now()-last.time<86400000){
    alert("لازم تستنى 24 ساعة");
    return;
  }

  orders.push({
    user,service,qty,link,
    status:"جاري التنفيذ",
    time:Date.now()
  });

  localStorage.setItem("orders",JSON.stringify(orders));
  alert("تم استلام الطلب (تجريبي)");
}

/* ===== LOAD ORDERS ===== */
function loadOrders(){
  let box=document.getElementById("ordersBox");
  let user=localStorage.getItem("currentUser");
  let orders=JSON.parse(localStorage.getItem("orders")||"[]")
    .filter(o=>o.user===user);

  box.innerHTML="";
  orders.forEach(o=>{
    let remain=Math.max(0,86400000-(Date.now()-o.time));
    box.innerHTML+=`
    <div class="badge">
      الخدمة: ${o.service}<br>
      الكمية: ${o.qty}<br>
      الحالة: ${o.status}<br>
      الرابط: ${o.link}<br>
      إعادة الطلب بعد: ${Math.ceil(remain/3600000)} ساعة<br>
      السعر: مجاني<br>
      التواصل: 01556177235
    </div>`;
  });
}

/* ===== ADMIN ===== */
function adminLogin(){
  if(adminPass.value==="Light@2882011"){
    location.href="admin.html";
  }else alert("باسورد خاطئ");
}

function loadAdmin(){
  let box=document.getElementById("adminBox");
  let orders=JSON.parse(localStorage.getItem("orders")||"[]");
  let users=JSON.parse(localStorage.getItem("users")||"[]");

  box.innerHTML="<h3>الطلبات</h3>";
  orders.forEach((o,i)=>{
    box.innerHTML+=`
    <div class="badge">
      المستخدم: ${o.user}<br>
      ${o.service} - ${o.qty}<br>
      ${o.link}<br>
      الحالة: ${o.status}<br>
      <button onclick="finish(${i})">تم التنفيذ</button>
    </div>`;
  });

  box.innerHTML+="<h3>المستخدمين</h3>";
  users.forEach(u=>{
    box.innerHTML+=`
    <div class="badge">
      ${u.username}<br>
      ${u.date}
    </div>`;
  });
}

function finish(i){
  let orders=JSON.parse(localStorage.getItem("orders"));
  orders[i].status="تم التنفيذ";
  localStorage.setItem("orders",JSON.stringify(orders));
  loadAdmin();
}
