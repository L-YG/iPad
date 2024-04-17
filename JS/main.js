/* FILE CONNECT */
import ipads from '../data/ipads.js';
import navigations from '../data/navigations.js';



/* BASKET-STARTER */
const basketStarterEl = document.querySelector('header .basket-starter');
const basketEl = basketStarterEl.querySelector('.basket'); // 중복을 줄임

// 추상화 개념
function showBasket () {
  basketEl.classList.add('show')
}
function hideBasket () {
  basketEl.classList.remove('show')
}

basketStarterEl.addEventListener('click', function (event) {
  // basketStarterEl을 클릭하면 밑에 정의된 window 객체도 실행되기 때문에 사용함
  event.stopPropagation() //상위 객체, 즉 window 객체로 전파(실행)되는 것을 막음
  if (basketEl.classList.contains('show')){
    hideBasket()
  } else {
    showBasket()
  }
});
basketEl.addEventListener('click', function (event) { 
  // basket을 클릭하는 것은 곧 상속 관계에서 부모격인 basketStarter를 클릭하는 것과 같기 때문에 사용함
  event.stopPropagation() //상위 객체, 즉 basketStarterEl 객체로 전파(실행)되는 것을 막음
});
window.addEventListener('click', function () {
  hideBasket()
});



/* SEARCH-WRAP (애니메이션 처리 및 스크롤 고정) */
const headerEl = document.querySelector('header');
const headerMenuEls = [...headerEl.querySelectorAll('ul.menu > li')]; // 전개 연산자로 해체하고 배열 데이터로 변환
const searchWrapEl = headerEl.querySelector('.search-wrap');
const searchStarterEl = headerEl.querySelector('.search-starter');
const searchCloserEl = searchWrapEl.querySelector('.search-closer');
const searchShadowEl = searchWrapEl.querySelector('.shadow');
const searchInputEl = searchWrapEl.querySelector('input')
const searchAutoCompletesEl = searchWrapEl.querySelector('.autoCompletes')
const searchDelayEls = [...searchWrapEl.querySelectorAll('li')]; // 전개 연산자로 해체하고 배열 데이터로 변환

// 추상화 개념
function showSearch() {
  headerEl.classList.add('searching')
  stopScroll()
  document.documentElement.classList.add('fixed') // HTML에 클래스 추가
  headerMenuEls.reverse().forEach(function (el, index) {
    el.style.transitionDelay = index * .4 / headerMenuEls.length + 's' // 인덱스 크기만큼 시간을 더함, li 태그에 transition 태그가 있어야 delay 적용 가능함
  })
  searchDelayEls.forEach(function (el, index) {
    el.style.transitionDelay = index * .4 / searchDelayEls.length + 's'
  })
  setTimeout(function(){
    searchInputEl.focus() // input에 포커스
  },800)
};

function hideSearch() {
  headerEl.classList.remove('searching')
  playScroll()
  headerMenuEls.reverse().forEach(function (el, index) {
    el.style.transitionDelay = index * .4 / headerMenuEls.length + 's' // 인덱스 크기만큼 시간을 더함, li 태그에 transition 태그가 있어야 delay 적용 가능함
  })
  searchDelayEls.reverse().forEach(function (el, index) {
    el.style.transitionDelay = index * .4 / searchDelayEls.length + 's'
  })
  searchDelayEls.reverse() // 다시 뒤집어 줘야 다시 클릭할 때 정상적으로 위에서 부터 나타남
  searchInputEl.value = '' // searchWrap이 열리면 입력 데이터 초기화
};

// searchStarterEl.addEventListener('click', function () {
//   showSearch()
// });
// searchCloserEl.addEventListener('click', function () {
//   hideSearch()
// });
// searchShadowEl.addEventListener('click', function () {
//   hideSearch()
// });
// 위 코드 간소화
searchStarterEl.addEventListener('click', showSearch);
searchCloserEl.addEventListener('click', function (event) {
  hideSearch()
  event.stopPropagation()
});

// shadow와 text, search-icon, search-closer은 상속 관계가 아니기 때문에
// event.stopPropagation()를 써서 전파를 막을 필요가 없음
searchShadowEl.addEventListener('click', hideSearch);


function playScroll(){
  document.documentElement.classList.remove('fixed') // HTML에 클래스 추가
}
function stopScroll(){
  document.documentElement.classList.add('fixed') // HTML에 클래스 추가
}



/* HEADER ▶ MENU-STARTER (@MEDIA 메뉴 토글 기능) */
const menuStarterEl = document.querySelector('header .menu-starter')
menuStarterEl.addEventListener('click', function(){
  if(headerEl.classList.contains('menuing')){
  headerEl.classList.remove('menuing')
  searchInputEl.value = ''
  playScroll()
  } else { 
    headerEl.classList.add('menuing')
    stopScroll()
  }
})



/* HEADER ▶ SERRCH-INPUT (@MEDIA 헤더 검색 클릭 시 취소 나타냄) */
const searchTextFieldEl = document.querySelector('header .search-wrap .textfield')
const searchCancelerEl = document.querySelector('header .search-wrap .search-canceler')

searchTextFieldEl.addEventListener('click', function(){
  headerEl.classList.add('searching-mobile')
  searchInputEl.focus()
})
searchCancelerEl.addEventListener('click', function(){
  headerEl.classList.remove('searching-mobile')
})



/* 뷰포트 크기가 변경되면 class 제거 */
window.addEventListener('resize', function () {
  if (window.innerWidth <= 740){
    headerEl.classList.remove('searching')
  } else {
    headerEl.classList.remove('searching-mobile')
    headerEl.classList.remove('menuing')
  }
})



/* HEADER ▶ NAV (@MEDIA 메뉴 토글 버튼) */
const navEl = document.querySelector('nav')
const navMenuToggleEl = navEl.querySelector('.menu-toggler')
const navMenuShadowEl = navEl.querySelector('.shadow')

navMenuToggleEl.addEventListener('click', function () {
  if (navEl.classList.contains('menuing')){
    hideNavMenu()
  } else {
    showNavMenu()
  }
})
navEl.addEventListener('click', function (event) {
  event.stopPropagation()
})
navMenuShadowEl.addEventListener('click', hideNavMenu)
window.addEventListener('click', hideNavMenu)

function showNavMenu() {
  navEl.classList.add('menuing')
}
function hideNavMenu() {
  navEl.classList.remove('menuing')
}



/* INFO (각 글자 및 아이콘이 뷰포트에 보이면 나타내는 기능) */
const io = new IntersectionObserver(function (entries){ // 복수 형태의 배열 데이터가 들어옴
  entries.forEach(function (entry) { // 관찰하는 개별적인 대상
    if (!entry.isIntersecting){
      return // true의 경우 false로 변경되고 .show 추가, return이 되지 않고, false인 경우 true가 되고 return이 실행되면서 나가짐
    }
    entry.target.classList.add('show')
  });
});
// const io = new IntersectionObserver(function (entries){ // 복수 형태의 배열 데이터가 들어옴
//   entries.forEach(function (entry) { // 관찰하는 개별적인 대상
//     if (!entry.isIntersecting){ // true인 경우에만 실행
//       entry.target.classList.remove('show')
//       return // true의 경우 false가 되고 return이 되지 않고, false인 경우 true가 되고 return이 실행됨
//     }
//     entry.target.classList.add('show')
//   });
// });

const infoEls = document.querySelectorAll('.info')
// .info를 가진 데이터를 모두 배열 데이터로 불러옴
infoEls.forEach(function (el) {
  //요소.ovserve(데이터)
  io.observe(el)
})



/* VIDEO (비디오 재생 기능) */
const videoEl = document.querySelector('.stage video');
const playBtn = document.querySelector('.stage .controller--play');
const pauseBtn = document.querySelector('.stage .controller--pause');

playBtn.addEventListener('click', function () {
  videoEl.play() // 재생 메서드
  playBtn.classList.add('hide')
  pauseBtn.classList.remove('hide')
});
pauseBtn.addEventListener('click', function () {
  videoEl.pause() // 일시정지 메서드
  playBtn.classList.remove('hide')
  pauseBtn.classList.add('hide')
});



/* COMPARE ('당신에게 맞는 iPad는?) */
const itemsEl = document.querySelector('section.compare .items');
ipads.forEach(function(ipad){
  // 각 배열 데이터에 div 요소, class명 item을 추가
  const itemEl = document.createElement('div');
  itemEl.classList.add('item');

  // 배열을 추출하고 대입 연산자를 이용하여 <li>에 하나씩 추가
  let colorList = ''
  ipad.colors.forEach(function(color){
    colorList += `<li style="background-color: ${color};"></li>`
  });

  // 각 배열 데이터에서 각각의 정보를 HTML로 작성, 코드 하이라이팅 사용
  itemEl.innerHTML = 
    /* HTML */ `<div Class="thumbnail">
      <img src="${ipad.thumbnail}" alt="${ipad.name}">"
    </div>
    <ul class="colors">
      ${colorList}
    </ul>
    <h3 class="name">${ipad.name}</h3>
    <p class="tagline">${ipad.tagline}</p>
    <p class="price">￦${ipad.price.toLocaleString('en-us')}</p>
    <button class="btn">구입하기</button>
    <a href="${ipad.url}" class="link">더 알아보기</a>`;

  // 내용을 HTML로 밀어넣음
  itemsEl.append(itemEl);
});



/* NAVIGATIONS (네비게이션 메뉴를 불러오는 기능) */
const navigationEl = document.querySelector('footer .navigations')
navigations.forEach(function(nav){
  const mapEl = document.createElement('div')
  mapEl.classList.add('map')

  let mapList = ''
  nav.maps.forEach(function(map){
    mapList += 
    /* HTML */ `<li>
        <a href="${map.url}">${map.name}</a>
      </li>`
  })

  mapEl.innerHTML = 
  /* HTML */ `<h3>
    <span class="text">${nav.title}</span>"
  </h3>
  <ul>
    ${mapList}
  <ul>
  `
  //요소.append(데이터)
  navigationEl.append(mapEl)
})



/* LEGAL ▶ THIS-YEAR */
const thisYearEl = document.querySelector('footer span.this-year')
thisYearEl.textContent = new Date().getFullYear()