<script setup>
import { ref, computed, onMounted } from 'vue';

// 從 src/assets 資料夾匯入圖片。
// Vite/Webpack 會處理這個路徑，並在建置時將其轉換為最終可用的 URL。
import stickFigureImageUrl from './Man.png'; // 將路徑從 @/assets/ 改為 ./ (當前資料夾)
import cute1ImageUrl from './cute1.png';
import cute2ImageUrl from './cute2.png';
import cute3ImageUrl from './cute3.png';

// 將可愛圖片放入一個陣列中，方便在模板中使用 v-for
const cuteImages = [cute1ImageUrl, cute2ImageUrl, cute3ImageUrl];

// 建立一個響應式狀態 isYesClicked，用來追蹤「好」按鈕是否被點擊
const isYesClicked = ref(false);

// 新增狀態，用來控制是否顯示「下一頁」的內容
const showNextPage = ref(false);

// 新增：雪花效果的樣式陣列
const snowflakeStyles = ref([]);

onMounted(() => {
  const styles = [];
  for (let i = 0; i < 100; i++) { // 產生 100 個雪花
    styles.push({
      width: `${Math.random() * 5 + 4}px`, // 大小: 4px 到 9px
      height: `${Math.random() * 5 + 4}px`,
      left: `${Math.random() * 100}vw`, // 水平位置
      opacity: Math.random() * 0.7 + 0.3, // 透明度: 0.3 到 1.0
      animationDuration: `${Math.random() * 10 + 8}s`, // 動畫時間: 8s 到 18s
      animationDelay: `-${Math.random() * 10}s`, // 負延遲讓動畫一開始就錯開
    });
  }
  snowflakeStyles.value = styles;
});

// 建立一個響應式狀態 noButtonPosition，用來儲存「不好」按鈕的絕對位置
const noButtonPosition = ref({ top: null, left: null });

// 計算屬性，它會根據 noButtonPosition 的值生成 CSS 樣式物件
const noButtonStyle = computed(() => {
  if (noButtonPosition.value.top !== null) {
    return {
      position: 'absolute',
      top: `${noButtonPosition.value.top}px`,
      left: `${noButtonPosition.value.left}px`,
      transition: 'top 0.2s ease, left 0.2s ease', // 讓移動有平滑的過渡效果
    };
  }
  return {};
});

// 「好」按鈕的點擊事件處理函式
const handleYesClick = () => {
  isYesClicked.value = true;
};

// 「不好」按鈕的滑鼠移入事件處理函式
const moveNoButton = (event) => {
  const button = event.target;
  // 使用 .closest() 來尋找父層的 .question-container，這樣寫法更穩健，不怕未來 HTML 結構變動
  const container = button.closest('.question-container');
  if (!container) return; // 如果找不到 container，就直接返回，避免錯誤

  const containerRect = container.getBoundingClientRect();

  // 計算一個隨機的新位置，確保按鈕不會跑出視窗外
  const newTop = Math.random() * (containerRect.height - button.offsetHeight);
  const newLeft = Math.random() * (containerRect.width - button.offsetWidth);

  noButtonPosition.value = { top: newTop, left: newLeft };
};

// 修改：點擊「下一頁」按鈕的事件處理函式，用來顯示圖片頁面
const goToNextPage = () => {
  showNextPage.value = true;
};
</script>


<template>
  <div class="container">
    <!-- 下雪特效 -->
    <div class="snow-container">
      <!-- 使用 v-for 根據產生的樣式來渲染雪花 -->
      <div v-for="(style, index) in snowflakeStyles" :key="index" class="snowflake" :style="style"></div>
    </div>

    <!-- v-if 會根據 isYesClicked 的值來決定要顯示哪個區塊 -->
    <div v-if="!isYesClicked" class="question-container">
      <h1>Vicky，今年聖誕卡片準備好了嗎!!</h1>
      <div class="button-container">
        <!-- 點擊「是」會觸發 handleYesClick 方法 -->
        <button class="btn btn-yes" @click="handleYesClick">好</button>
        <!-- 
          滑鼠移到「否」按鈕上會觸發 moveNoButton 方法 
          :style 會綁定 noButtonStyle 來動態更新樣式
        -->
        <button
          class="btn btn-no"
          :style="noButtonStyle"
          @mouseover="moveNoButton"
          @touchstart.prevent="moveNoButton"
          @click="moveNoButton"
        >
          不好
        </button>
      </div>
    </div>

    <!-- 當 isYesClicked 變成 true 時，顯示這個成功區塊 -->
    <div v-else class="result-container">
      <!-- "下一頁" 的內容 -->
      <template v-if="showNextPage">
        <!-- 顯示可愛圖片的區塊 (移到最上面) -->
        <div class="image-gallery">
          <img v-for="(image, index) in cuteImages" :key="index" :src="image" alt="可愛圖片" class="cute-image" />
        </div>

        <h1>這是我的卡片!!</h1>

        <!-- 新增的文字區塊 -->
        <p class="message-text">
          嗨臭寶(雞腿)<br>
          這是今年的聖誕卡片!!<br>
        </p>
      </template>

      <!-- 初始 "結果" 頁的內容 -->
      <template v-else>
        <h1>聖誕快樂!!</h1>
        <h2>但你得先聞我的pp!</h2>
        <!-- 火柴人放屁動畫 -->
        <div class="animation-wrapper">
          <div class="stick-figure-container">
            <img :src="stickFigureImageUrl" alt="火柴人" class="stick-figure-image" />
            <div class="fart-cloud"></div>
          </div>
        </div>
        <!-- 下一頁按鈕 -->
        <button class="btn btn-next" @click="goToNextPage">下一頁</button>
      </template>
    </div>
  </div>
</template>



<style scoped>
/* scoped 屬性確保這些樣式只會套用在這個組件內 */
.container {
  display: flex; justify-content: center; align-items: center;
  height: 100vh; width: 100vw; text-align: center;
  background-color: #fce4ec; overflow: hidden;
}
.question-container, .result-container {
  position: relative;
  width: 90%;
  max-width: 600px; /* 新增最大寬度以優化大螢幕顯示 */
  z-index: 2; /* 確保內容在雪花特效之上 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
h1 {
  color: #c2185b;
  /* 調整 clamp() 中的 vw 單位，讓字體在手機等窄螢幕上能縮放得更舒適 */
  font-size: clamp(1.5rem, 8vw, 3rem);
  margin-bottom: 40px;
}
h2 { font-size: 2rem; color: #ad1457; }
.card-image {
  max-width: 90%;
  max-height: 40vh; /* 限制最大高度為視窗高度的 40% */
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
  margin-top: 20px;
  margin-bottom: 20px; /* 在圖片和動畫之間增加一些間距 */
  object-fit: contain; /* 確保圖片內容完整顯示不變形 */
}
/* 新增 flex-wrap: wrap，當螢幕寬度不足時，按鈕會自動換行，從而達成垂直排列的效果 */
.button-container { display: flex; justify-content: center; align-items: center; gap: 20px; flex-wrap: wrap; }
.btn { padding: 15px 30px; font-size: 1.5rem; border: none; border-radius: 8px; cursor: pointer; color: white; font-weight: bold; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
.btn-yes { background-color: #4caf50; }
.btn-no { background-color: #f44336; }
.btn-next { background-color: #2196F3; margin-top: 20px; } /* 新增：下一頁按鈕的樣式 */

/* --- 新增：中間訊息文字樣式 --- */
.message-text {
  font-size: 1.2rem;
  color: #444; /* 深灰色，比標題柔和 */
  margin-top: 15px; /* 與上方標題的間距 */
  line-height: 1.7; /* 增加行高，讓多行文字更易讀 */
}

/* --- 新增：可愛圖片藝廊樣式 --- */
.image-gallery {
  display: flex;
  justify-content: center;
  gap: 15px; /* 圖片之間的間距 */
  margin-bottom: 20px; /* 圖片區塊與下方標題的間距 */
  flex-wrap: wrap; /* 在小螢幕上自動換行 */
}
.cute-image {
  width: 150px; height: 150px; object-fit: cover; /* 確保圖片不變形 */
  border-radius: 10px; /* 圓角 */
  box-shadow: 0 4px 8px rgba(0,0,0,0.15); /* 陰影效果 */
}

/* --- 動畫相關樣式 --- */
.animation-wrapper {
  position: relative;
  height: 150px; /* 維持 wrapper 高度 */
  width: 200px; /* 維持 wrapper 寬度 */
}

/* 新增：用來包裹圖片和屁雲的容器 */
.stick-figure-container {
  position: relative; /* 讓屁雲可以相對於它定位 */
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end; /* 讓火柴人圖片對齊底部 */
}

/* 新增：火柴人圖片的樣式 */
.stick-figure-image {
  height: 140px; /* 設定圖片高度 */
  width: auto; /* 寬度自動，保持比例 */
}

.fart-cloud {
  width: 15px; height: 15px; background-color: #8BC34A; border-radius: 50%;
  position: absolute;
  /* 根據 Man.png 圖片調整屁雲的初始位置 */
  /* 您可能需要微調這些值，讓它對準屁股 */
  bottom: 30px;
  left: 60px;
  opacity: 0;
  filter: blur(3px);
  animation: fart-animation 2s ease-in-out infinite;
  animation-delay: 0.5s;
}

/* 定義動畫關鍵影格 */
@keyframes fart-animation {
  0% { transform: scale(0) translateX(0); opacity: 0; } /* 從無到有 */
  20% { transform: scale(1.2) translateX(-20px); opacity: 0.8; } /* 往後(左)噴出 */
  100% { transform: scale(2.5) translateX(-150px); opacity: 0; } /* 往後(左)擴散並消失 */
}

/* --- 新增：下雪特效樣式 --- */
.snow-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none; /* 讓滑鼠可以點擊下層的元素 */
  z-index: 1;
}

.snowflake {
  position: absolute;
  top: -10px; /* 從螢幕上方開始 */
  border-radius: 50%;
  background: white;
  animation-name: snowfall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes snowfall {
  to { transform: translateY(100vh); } /* 直直落下到螢幕底部 */
}
</style>