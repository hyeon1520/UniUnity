//글 에디터
const Editor = toastui.Editor;

var userInfo; //유저정보

//작성자 회원 정보 불러오기
const loadloginData = () => {
  const url = `http://localhost:3000/loginStatus`;
  fetch(url)
    .then((res) => res.json())
    .then(res => {
      console.log(res);
      userInfo = res;
    }
    )
}


const editor = new toastui.Editor({
  el: document.querySelector('#editor'),
  previewStyle: 'vertical',
  initialEditType: 'wysiwyg',
  previewHighlight: false,
  initialValue: '',
  height: '1000px',
  // 사전입력 항목
  // 이미지가 Base64 형식으로 입력되는 것 가로채주는 옵션
  hooks: { 
    async addImageBlobHook(blob, callback) {
    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('file', blob);
  //   파일 업로드 API 호출
      const response = await fetch('http://localhost:3000/file', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // 파일 업로드 성공
        const { fileUrl } = await response.json();

        // 콜백 함수 호출하여 에디터에 이미지 추가
        callback(fileUrl, 'alt text');
      } else {
        // 파일 업로드 실패
        console.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }
  },
});
// const editor = new Editor({
//   el: document.querySelector('#editor'),
//   height: '500px',
//   initialEditType: 'wysiwyg',
//   previewStyle: 'vertical',
//   hooks: {
//     async addImageBlobHook(blob, callback) {
      
//       try{
//         // console.log(blob)
//       // FormData 생성
      
//       const formData = new FormData();
//       formData.append('file', blob);
//       // console.log("formData:",formData.get('file'));

//         //   파일 업로드 API 호출
//       // const response = await fetch('http://localhost:3000/file', {
//       //   method: 'POST',
//       //   body: formData,
//       // });
//     } catch (error) {
//       //       console.error('Error uploading image:', error);
//       //     }
//     }
//   }
// }
// });

// const uploadImages = (blob, callback) => {
//   let formData = new FormData();
//   formData.append("images", blob);

//   $.ajax({
//       type: 'POST',
//       enctype: 'multipart/form-data',
//       url: '/common/fileUpload',
//       data: formData,
//       dataType: 'json',
//       processData: false,
//       contentType: false,
//       cache: false
//   }).fail(function() {
//       callback('image_load_fail');
//   }).done(function(data) {
//       callback(data);
//   });
// }

//카테고리 선택
var selectedValue;
const partnerCategory = document.querySelector('#partnerCategory'),
  sotreUpload = document.querySelector('#sotreUpload'),
  postWrite = document.querySelector('#postWrite');
const selectPostCategoryElement = document.getElementById('select_post_category');
const postTitle = document.getElementById('post_title');
const postSubmitBtn = document.getElementById('post_submit_btn');

function uploadPost(postCategory) {
  console.log(editor.getHTML());
  const req = {
    user_email: userInfo.user_email,
    post_title: postTitle.value,
    post_content: editor.getHTML(),
    category: postCategory,
    university_id: userInfo.university_id
  };
  console.log(req);

  fetch(`http://localhost:3000/uploadPost`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then(res => {
      if (res.status === 201) {
        console.log("게시글 작성 완료");
        window.location.href = `/showPostListAll/${userInfo.university_url}`; // 리다이렉션 처리
      } else {
        alert("서버의 문제로 게시글 작성이 실패했습니다. 다시 시도해주세요.");
      }
    })
    .catch((error) => {
      console.error("Error: ", error);
      alert("서버의 문제로 게시글 작성이 실패했습니다. 다시 시도해주세요.");
    })
}


selectPostCategoryElement.addEventListener('change', function () {
  selectedValue = this.value;
  // 제휴가게 등록하기 로드
  if (selectedValue == "제휴 소식") {
    postWrite.style.display = "none";
    sotreUpload.style.display = "block";
    loadPartnerUpload();
    storeUploadBtn.addEventListener('click', function () {
      try {
        updateStore();
        alert("등록이 완료되었습니다.");
      } catch {
        alert("등록이 실패했습니다. 올바른 정보를 입력하셨는지 확인해주세요.")
      }

    });
  }
  //게시글 작성에디터
  else {
    postWrite.style.display = "block";
    sotreUpload.style.display = "none";

    postSubmitBtn.addEventListener('click', function () {
      uploadPost(selectedValue);

    });


  }
});

// 제휴 등록 폼에 필요한 변수들
const storeUploadBtn = document.querySelector('#uploadBtn'),
  BtnAddr = document.querySelector('#serchBtnAddr'),
  BtnContent = document.querySelector('#serchBtnContent');
const storeName = document.querySelector('#storeName'),
  store_location = document.querySelector('#store_location'),
  content = document.querySelector('#content'),
  startDate = document.querySelector('#startDate'),
  endDate = document.querySelector('#endDate');
var getlatitude, getlongitude;
// 제휴 등록 페이지에 필요한 함수 고정 코드
// ===========================================================================================
// university_url 값을 받아오는 함수
function getUniversityUrl() {
  // 현재 페이지의 URL에서 경로(pathname) 부분을 추출
  const path = window.location.pathname;

  // 경로에서 universityUrl 값을 추출
  const pathParts = path.split('/');
  const universityUrl = pathParts[pathParts.length - 1];
  return universityUrl;
}

function setCenter(map, latitude, longitude) {
  // 이동할 위도 경도 위치를 생성합니다
  var moveLatLon = new kakao.maps.LatLng(latitude, longitude);

  // 지도 중심을 이동 시킵니다
  map.setCenter(moveLatLon);
}

function updateStore() {
  const universityUrl = getUniversityUrl();
  const req = {
    storeName: storeName.value,
    store_location: store_location.value,
    latitude: getlatitude,
    longitude: getlongitude,
    content: content.value,
    startDate: startDate.value,
    endDate: endDate.value,
    university_url: universityUrl
  };

  fetch(`http://localhost:3000/uploadPartner`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then(res => {
      console.log(res);
    })
}
function loadPartnerUpload() {
  var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
      level: 3 // 지도의 확대 레벨
    };

  // 지도를 생성합니다    
  var map = new kakao.maps.Map(mapContainer, mapOption);

  // 학교별로 중심좌표 이동시키기
  const universityUrl = getUniversityUrl();
  const req = {
    university_url: universityUrl
  };

  fetch(`http://localhost:3000/getUniversityLocation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  }).then((res) => res.json())
    .then(res => {
      setCenter(map, parseFloat(res.latitude), parseFloat(res.longitude));
    })

  // 주소-좌표 변환 객체를 생성합니다
  var geocoder = new kakao.maps.services.Geocoder();

  BtnAddr.addEventListener('click', function () {
    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(store_location.value, function (result, status) {

      // 정상적으로 검색이 완료됐으면 
      if (status === kakao.maps.services.Status.OK) {

        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        getlatitude = parseFloat(result[0].y);
        getlongitude = parseFloat(result[0].x);

        // 결과값으로 받은 위치를 마커로 표시합니다
        var marker = new kakao.maps.Marker({
          map: map,
          position: coords
        });

        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        map.setCenter(coords);
      }
    });
  })
}
// ===========================================================================================
//page 로드 후 loadData()실행
window.addEventListener('DOMContentLoaded', function()
{
  loadloginData();
});