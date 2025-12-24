<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
// 從當前資料夾匯入資源。
// Vite/Webpack 會處理這個路徑，並在建置時將其轉換為最終可用的 URL。
import stickFigureImageUrl from './Man.png'; // 將路徑從 @/assets/ 改為 ./ (當前資料夾)
import cute1ImageUrl from './cute1.png';
import cute2ImageUrl from './cute2.png';
import cute3ImageUrl from './cute3.png';
import cute4ImageUrl from './cute4.png';  
import japan1ImageUrl from './japan1.png';
import japan2ImageUrl from './japan2.png';
import japan3ImageUrl from './japan3.png';
import japan4ImageUrl from './japan4.png';
import foodImageUrl from './food.png';
import girlImageUrl from './girl.png';
import faceImageUrl from './face.png';
// 匯入音樂檔案。請確保您在同一個資料夾下有一個名為 `christmas-music.mp3` 的音樂檔。
import christmasMusicUrl from './music.mp3';
import fartSoundUrl from './fart.mp3'; // 匯入放屁音效
import tree1GifUrl from './tree1.gif'; // 匯入聖誕樹 GIF
import coolImageUrl from './cool.png'; // 匯入 cool 圖片


// 將可愛圖片放入一個陣列中，方便在模板中使用 v-for
const cuteImages = [cute1ImageUrl, cute2ImageUrl, cute3ImageUrl, cute4ImageUrl];

// 建立一個響應式狀態 isYesClicked，用來追蹤「好」按鈕是否被點擊
const isYesClicked = ref(false);

// 將頁面步驟改為數字，以便管理多個頁面
// 0: 聞屁頁, 1: 文字輸入頁, 2: 最終卡片頁
const resultStep = ref(0);

// 新增：自訂選單的開關狀態
const isMenuOpen = ref(false);

// 新增：用於顯示特殊頁面的狀態
const specialPage = ref(null); // null, 'japan1', 'japan2', 'cute'

const userMessage = ref(''); // 用來儲存使用者輸入的文字

// 新增：建立一個 audio 元素的響應式引用
const audioPlayer = ref(null);

// 新增：錯誤/成功訊息的響應式狀態
const errorMessage = ref('');
const successMessage = ref('');
const isChecking = ref(false); // 用來在驗證期間禁用按鈕

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

// 修改：點擊「下一頁」按鈕的事件處理函式，用來推進到下一個步驟
const goToNextStep = () => {
  // 在步驟 1 (稱號輸入頁)，需要驗證稱號
  if (resultStep.value === 1) {
    if (isChecking.value) return; // 如果正在倒數，則不執行任何操作

    if (userMessage.value.trim() === '雞腿') {
      isChecking.value = true; // 禁用按鈕
      errorMessage.value = ''; // 清除錯誤訊息
      let countdown = 3;
      successMessage.value = `答對了啦！ ${countdown} 秒後顯示卡片...`;

      const interval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
          successMessage.value = `答對了啦！ ${countdown} 秒後顯示卡片...`;
        } else {
          clearInterval(interval);
          resultStep.value++; // 倒數結束後跳轉
        }
      }, 1000);
    } else {
      // 驗證失敗，顯示提示並清空輸入
      errorMessage.value = '錯！!喇搭貴!!';
      userMessage.value = '';
    }
  } else {
    // 其他頁面 (步驟 0, 2) 直接進入下一步驟
    resultStep.value++;
  }
};

// 新增：點擊火柴人圖片播放音效的函式
const playFartSound = () => {
  // 每次點擊都建立一個新的 Audio 物件來播放
  // 這樣可以避免一些在不同裝置或瀏覽器上的播放問題
  const audio = new Audio(fartSoundUrl);
  audio.play().catch(error => {
    console.error("音效播放失敗：", error);
  });
};

// 新增：切換選單開關的函式
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// 新增：顯示特殊頁面的函式
const showSpecialPage = (pageName) => {
  specialPage.value = pageName;
  isMenuOpen.value = false; // 點擊後關閉選單
  playFartSound();
};

// 新增：回到開頭的函式
const resetApp = () => {
  isYesClicked.value = false;
  resultStep.value = 0;
  userMessage.value = '';
  errorMessage.value = '';
  successMessage.value = '';
  if (audioPlayer.value) {
    audioPlayer.value.pause();
    audioPlayer.value.currentTime = 0;
  }
  specialPage.value = null; // 重設特殊頁面狀態
};

// 新增：點擊選單項目後，回到開頭並關閉選單
const resetAppAndCloseMenu = () => {
  resetApp();
  isMenuOpen.value = false;
};

// 監聽 isYesClicked 的變化，在點擊「好」之後播放音樂
watch(isYesClicked, (isClicked) => {
  // 當 isYesClicked 變為 true 時
  if (isClicked) {
    // 使用 nextTick 確保 <audio> 元素已經被渲染到 DOM 中
    nextTick(() => {
      if (audioPlayer.value) {
        audioPlayer.value.play().catch(error => {
          // 處理瀏覽器阻止自動播放的錯誤
          console.error("音樂播放失敗：", error);
        });
      }
    });
  }
});
</script>


<template>
  <!-- 新增：自訂漢堡選單，只在 cool shit 頁面顯示 -->
  <div v-if="resultStep === 3" class="custom-menu-container">
    <button @click="toggleMenu" class="menu-toggle-btn" :class="{ 'is-open': isMenuOpen }">
      <span class="bar"></span><span class="bar"></span><span class="bar"></span>
    </button>
    <div v-if="isMenuOpen" class="menu-overlay" @click="toggleMenu"></div>
    <nav class="menu-panel" :class="{ 'is-open': isMenuOpen }">
      <a @click="showSpecialPage('japan1')">邱餅餅日本part1</a>
      <a @click="showSpecialPage('japan2')">邱餅餅日本part2</a>
      <a @click="showSpecialPage('cute')">邱餅餅可i</a>
      <a @click="showSpecialPage('meandu')">it's me and u</a>
    </nav>
  </div>
  <div class="container">
    <!-- 新增：背景音樂播放器 -->
    <audio ref="audioPlayer" :src="christmasMusicUrl" loop></audio>

    <!-- 下雪特效 -->
    <div class="snow-container">
      <!-- 使用 v-for 根據產生的樣式來渲染雪花 -->
      <div v-for="(style, index) in snowflakeStyles" :key="index" class="snowflake" :style="style"></div>
    </div>

    <!-- 新增：聖誕樹 GIF，只在點擊「好」之後顯示 -->
    <template v-if="isYesClicked && resultStep < 2">
      <img :src="tree1GifUrl" alt="聖誕樹" class="christmas-tree" />
    </template>

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
      <!-- 步驟 2: 最終卡片頁 -->
      <template v-if="resultStep === 2">
        <!-- 顯示可愛圖片的區塊 (移到最上面) -->
        <div class="image-gallery">
          <img v-for="(image, index) in cuteImages" :key="index" :src="image" alt="可愛圖片" class="cute-image" />
        </div>

        <div class="title-container">
          <h2>嗨臭寶(雞腿)</h2>
          <!-- 新增：前往下一頁的小按鈕 -->
          <button class="btn btn-small-next" @click="goToNextStep">Some cool shit</button>
        </div>

        <!-- 新增的文字區塊 -->
        <p class="message-text">
          聖誕快樂!我們在一起3年多ㄌ，覺得跟你在一起的時候時間都過好快(快樂啦)，中間有好多困難我們一起度過，
          你工作常常會跟我抱怨，但你還是很負責任的把他們做好，雖然常常成果不是很好，但你還是朝著你喜歡的事物前進(我覺得很棒喔)，以後我還是會繼續支持你做的東東然後給你些有用的建議，
          希望我們明年可以出國2次!!每次出國玩都好快樂喔，但我也想跟家人但也想跟你，好猶豫喔(>,<)，好啦愛妳拉臭臭，明年一起加油ㄋ一ㄚ!!
          就這樣!!愛你的雞腿男!!<br>
          <br>
        </p>
      </template>

      <!-- 步驟 3: 顯示 cool.png 的最終頁 -->           
      <template v-else-if="resultStep === 3">
        <!-- 特殊頁面 (fixed 定位) -->
        <template v-if="specialPage === 'japan1'">
          <div class="special-page-layout">
            <div class="image-container">
              <img :src="japan3ImageUrl" alt="邱餅餅日本 上">
            </div>
            <div class="text-container">
              <p>第一次去日本啦，雖然搭飛機很可怕但跟你第一次出國感覺很舒服!還想再去!</p>
            </div>
            <div class="image-container">
              <img :src="japan4ImageUrl" alt="邱餅餅日本 下">
            </div>
          </div>
        </template>
        <template v-else-if="specialPage === 'japan2'">
          <div class="special-page-layout">
            <div class="image-container">
              <img :src="japan1ImageUrl" alt="邱餅餅日本two 上">
            </div>
            <div class="text-container">
              <p>跟著公司一起去，只有3天，太少了!!這次還好有邱邱，不然我可能會覺得很無聊!</p>
            </div>
            <div class="image-container">
              <img :src="japan2ImageUrl" alt="邱餅餅日本two 下">
            </div>
          </div>
        </template>
        <template v-else-if="specialPage === 'cute'">
          <div class="special-page-layout">
            <div class="image-container">
              <img :src="foodImageUrl" alt="邱餅餅可i 上">
            </div>
            <div class="text-container">
              <p>送你麵麵啦，還有可愛寶>.<</p>
            </div>
            <div class="image-container">
              <img :src="girlImageUrl" alt="邱餅餅可i 下">
            </div>
          </div>
        </template>
        <template v-else-if="specialPage === 'meandu'">
          <img :src="faceImageUrl" alt="it's me and u" class="cool-image" />
        </template>

        <!-- 預設顯示 cool.png (只有在沒有特殊頁面時才顯示) -->
        <img v-else :src="coolImageUrl" alt="Cool" class="cool-image" />
      </template>

      <!-- 步驟 1: 新增的文字輸入頁 -->
      <template v-else-if="resultStep === 1">
        <h1>你要答對你的稱號才能領取你的卡片</h1>
        <textarea v-model="userMessage" @input="errorMessage = ''" class="message-textarea" placeholder="輸入你的稱號！(提示：一個好吃的部位)"></textarea>
        <button class="btn btn-next" @click="goToNextStep" :disabled="isChecking">完成！</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </template>

      <!-- 步驟 0: 初始 "結果" 頁的內容 -->
      <template v-else-if="resultStep === 0">
        <h1>聖誕快樂!!</h1>
        <h2>但你得先聞我的pp!</h2>
        <!-- 火柴人放屁動畫 -->
        <div class="animation-wrapper">
          <div class="stick-figure-container" @click="playFartSound" style="cursor: pointer;">
            <img :src="stickFigureImageUrl" alt="火柴人" class="stick-figure-image" />
            <div class="fart-cloud"></div>
            <div class="click-me-text">Click me!!!</div>
          </div>
        </div>
        <!-- 下一頁按鈕 -->
        <button class="btn btn-next" @click="goToNextStep">下一頁</button>
      </template>
    </div>
  </div>
</template>



<style scoped>
/* scoped 屬性確保這些樣式只會套用在這個組件內 */
.container {
  display: flex; justify-content: center; align-items: center;
  height: 100vh; width: 100vw; text-align: center;
  background-color: #fce4ec;
  overflow: hidden;
  /* 新增：為符合 iPhone 等裝置的安全區域 (劉海)，增加 padding */
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box; /* 確保 padding 不會影響整體的 100vh/100vw 計算 */
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
h2 { font-size: 2rem; color: #ad1457; margin: 0; } /* 移除預設的 margin */
.card-image {
  max-width: 90%;
  max-height: 40vh; /* 限制最大高度為視窗高度的 40% */
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
  margin-top: 20px;
  margin-bottom: 20px; /* 在圖片和動畫之間增加一些間距 */
  object-fit: contain; /* 確保圖片內容完整顯示不變形 */
}

/* 新增：給 Mygirl GIF 的樣式 */
.my-girl-gif {
  max-width: 250px; /* 設定一個最大寬度 */
  border-radius: 15px;
  margin-top: 20px;
  margin-bottom: 20px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}
/* 新增 flex-wrap: wrap，當螢幕寬度不足時，按鈕會自動換行，從而達成垂直排列的效果 */
.button-container { display: flex; justify-content: center; align-items: center; gap: 20px; flex-wrap: wrap; }
.btn { padding: 15px 30px; font-size: 1.5rem; border: none; border-radius: 8px; cursor: pointer; color: white; font-weight: bold; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
.btn-yes { background-color: #4caf50; }
.btn-no { background-color: #f44336; }
.btn-next { background-color: #2196F3; margin-top: 20px; } /* 新增：下一頁按鈕的樣式 */
/* 新增：小按鈕的樣式，繼承 .btn 的部分樣式 */
.btn-small-next {
  padding: 8px 20px;
  font-size: 1rem;
  background-color: #ff85c0; /* 可愛粉紅色 */
  margin-top: 0; /* 移除 margin-top */
}

/* --- 新增：標題與按鈕的容器 --- */
.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px; /* 標題和按鈕之間的間距 */
}
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

/* 新增：Cool 圖片的樣式 */
.cool-image {
  max-width: 90%;
  max-height: 80vh;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  margin-top: 40px; /* 新增：避免圖片太靠上，給選單按鈕留出空間 */
}

/* --- 新增：文字輸入框樣式 --- */
.message-textarea {
  width: 90%;
  max-width: 500px;
  height: 150px;
  margin-top: 20px;
  padding: 15px;
  font-size: 1.1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  resize: vertical;
  font-family: inherit; /* 繼承父層的字體 */
}

/* --- 新增：顯示使用者留言的樣式 --- */
.user-message-display {
  margin-top: 25px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.7); /* 半透明白色背景 */
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  text-align: left;
}
.user-message-display p:first-child { color: #ad1457; margin-bottom: 10px; }
.user-text { white-space: pre-wrap; font-size: 1.1rem; color: #333; line-height: 1.6; }

/* --- 新增：錯誤與成功訊息樣式 --- */
.error-message {
  margin-top: 15px;
  color: #c2185b; /* 使用主題的深紅色 */
  font-weight: bold;
}

.success-message {
  margin-top: 15px;
  color: #4caf50; /* 綠色 */
  font-weight: bold;
}

/* --- 新增：點擊提示文字樣式 --- */
.click-me-text {
  position: absolute;
  top: 50%;
  right: -60px; /* 調整位置，讓它更靠右邊一點 */
  transform: translateY(-100%); /* 往上移動一點 */
  background-color: #ff85c0; /* 一個可愛的粉紅色 */
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-weight: bold;
  font-size: 0.9rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  pointer-events: none; /* 讓點擊可以穿透文字，觸發火柴人的事件 */
  animation: bounce-light 2s infinite ease-in-out;
}

/* --- 新增：輕微跳動動畫 --- */
@keyframes bounce-light {
  0%, 100% { transform: translateY(-100%) scale(1); }
  50% { transform: translateY(-120%) scale(1.05); }
}

/* --- 新增：聖誕樹樣式 --- */
.christmas-tree {
  position: absolute;
  top: 0; /* 改為最上面 */
  left: 50%; /* 水平置中 */
  transform: translateX(-50%); /* 水平置中 */
  width: 180px; /* 調整聖誕樹大小 */
  height: auto;
  z-index: 1; /* 確保在內容下方，雪花層級 */
  pointer-events: none; /* 避免擋住點擊 */
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

/* --- 新增：自訂漢堡選單樣式 --- */
.menu-toggle-btn {
  position: fixed;
  /* 考慮到 iPhone 安全區域 */
  top: calc(15px + env(safe-area-inset-top, 0px));
  left: calc(15px + env(safe-area-inset-left, 0px));
  z-index: 1001;
  background: transparent;
  border: none;
  width: 50px;
  height: 50px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.menu-toggle-btn .bar {
  width: 30px;
  height: 3px;
  background: #c2185b; /* 主題深紅色 */
  border-radius: 2px;
  transition: all 0.3s ease-in-out;
  margin: 4px 0;
}

/* 漢堡按鈕變叉叉的動畫 */
.menu-toggle-btn.is-open .bar:nth-child(1) {
  transform: translateY(11px) rotate(45deg);
}
.menu-toggle-btn.is-open .bar:nth-child(2) {
  opacity: 0;
}
.menu-toggle-btn.is-open .bar:nth-child(3) {
  transform: translateY(-11px) rotate(-45deg);
}

.menu-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background: rgba(252, 228, 236, 0.9); /* 半透明主題色 */
  backdrop-filter: blur(8px); /* 毛玻璃效果 */
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
  /* 考慮到 iPhone 安全區域 */
  padding-top: calc(80px + env(safe-area-inset-top, 0px));
  padding-left: env(safe-area-inset-left, 0px);
}

.menu-panel.is-open {
  transform: translateX(0);
}

.menu-panel a {
  display: block;
  padding: 15px 25px;
  color: #c2185b;
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-panel a:hover {
  background-color: rgba(194, 24, 91, 0.1);
}

.menu-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
}

/* --- 新增：特殊頁面樣式 --- */
.special-page-layout {
  position: fixed; /* 固定在視窗上，覆蓋其他內容 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column; /* 改為垂直排列 */
  /* 套用安全區域 padding 以確保全螢幕內容正確顯示 */
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;
  background-color: #fce4ec; /* 與背景色相同 */
  z-index: 998; /* 確保在內容之上，但在選單遮罩 (999) 和選單 (1000) 之下 */
}

.special-page-layout .image-container {
  flex: 1; /* 讓圖片容器平分剩餘空間 */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden; /* 避免圖片過大時溢出 */
}

.special-page-layout .text-container {
  flex-shrink: 0; /* 文字區塊不壓縮 */
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: #444;
  line-height: 1.8;
  text-align: center;
}

.special-page-layout img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}
</style>