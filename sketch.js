// --- 全域變數 ---
let sheet1;             
let sheet2;             
let sheet3;             
let sheet4;             
let sheet5;             
let sheet6;             
let bulletImgR;         
let bulletImgL;         
let backgroundImg;      
let inputBox; 
let inputWidth = 150;
let inputHeight = 30;

// --- 角色二 / 新互動目標 相關變數 ---
let sheet2P;                         
let sheet2P_hit_1;                  
let sheet2P_hit_2;                  
let sheet2P_hit_3;                  
let p2StandardSize = { w: 45, h: 52 };   
let p2HitSize = { w: 48, h: 46 };       
let p2MaxHeight;                    
let p2X;
let p2Y;
let p2Frames = [];                   
let p2AnimationSpeed = 10;          
let p2State = 'idle';               
const P2_INTERACTION_DISTANCE = 200; 
let showDialogue = false;           
let dialogueText = "勇士您的名字叫什麼？";    
let isNameEntered = false;          
let playerInputName = "";            
let p2ReplyText = "";               
let p2ReplyDuration = 180;         
let p2ReplyTimer = 0;              
const P2_HIT_1_FRAME_INDEX = 4;        
const P2_HIT_2_FRAME_INDEX = 5;        
const P2_HIT_3_FRAME_INDEX = 6;        
let hitFrameDuration = 60;    
let hitTimer = 0;             
let isP2LockedOnFinalFrame = false; 
let p2FinalDialogue = "勇者大人請您不要再亂來了"; 
let p2FinalReplyDuration = 180; 
let p2FinalReplyTimer = 0;
let p2HitCount = 0;            
const requiredHits = 3;       

// --- 主角/物理/狀態 相關變數 ---
let frameSize1 = { w: 55, h: 60 };  
let frameSize2 = { w: 50, h: 60 };  
let frameSize3 = { w: 47.2, h: 60 }; 
let frameSize4 = { w: 47, h: 60 };  
let frameSize5 = { w: 45, h: 51 };  
let frameSize6 = { w: 45, h: 51 };  
let bulletSize = { w: 24, h: 10 };  
let maxHeight;          
let xPos;
let yPos;
let imgScale = 3;       
let moveSpeed = 4;
let frameRateFactor = 5; 
let gravity = 0.5;      
let jumpForce = -10;    
let jumpVelocity = 0;   
let groundY;            
let backgroundGroundRatio = 0.25; 
let groundRatio = backgroundGroundRatio; 
let isJumping = false;  
let upwardThrust = -0.3; 
let state = 'idle';     
let currentFrame = 0;
let facingDirection = 1; 
let prevState = '';     
let isFlying = false; 
let isKeyboardLocked = false; 
let comboCount = 0;          
let comboTimer = 0;          
let comboResetDelay = 15;    
let bullets = [];        
let bulletSpeed = 15;   
let idleFrames = []; 
let walkFrames = [];   
let jumpFrames = [];    
let flyFrames = [];     
let attackFramesR = []; 
let attackFramesL = []; 

// --- 雲朵變數 ---
let clouds = [];
let numClouds = 5;
let cloudSpeed = 0.5;   

// --- 問答題庫與狀態 ---
let quizData = [];
let currentQuestion = null; // 當前問題物件
let isAwaitingAnswer = false;

/**
 * 預載入圖片
 */
function preload() {
  sheet1 = loadImage('1020004-removebg-preview.png');
  sheet2 = loadImage('1020005-removebg-preview.png');
  sheet3 = loadImage('1110006-removebg-preview.png'); 
  sheet4 = loadImage('11120009-removebg-preview.png'); 
  sheet5 = loadImage('23051-removebg-preview.png');   
  sheet6 = loadImage('230X51-removebg-preview.png'); 
  bulletImgR = loadImage('16-removebg-preview.png');   
  bulletImgL = loadImage('24-removebg-preview.png');   
  
  sheet2P = loadImage('45X52-removebg-preview.png'); 
  sheet2P_hit_1 = loadImage('4846_1-removebg-preview.png');
  sheet2P_hit_2 = loadImage('4846_2-removebg-preview.png');
  sheet2P_hit_3 = loadImage('4846-removebg-preview.png');
    
  backgroundImg = loadImage('背景.jpg'); 
}

/**
 * 初始化畫布與動畫幀
 */
function setup() {
  createCanvas(windowWidth, windowHeight); 
  fillQuizData();
  
  p2MaxHeight = Math.max(p2StandardSize.h, p2HitSize.h); 
  maxHeight = Math.max(frameSize1.h, frameSize2.h, frameSize3.h, frameSize4.h, frameSize5.h, frameSize6.h, p2MaxHeight); 
  
  let groundHeight = height * groundRatio;
  let groundLineY = height - groundHeight;
  let charHalfHeight = maxHeight * imgScale / 2;
  groundY = groundLineY - charHalfHeight; 
  
  yPos = groundY; 
  xPos = width / 2;
  
  let p2HalfHeight = p2MaxHeight * imgScale / 2;
  p2Y = groundLineY - p2HalfHeight; 
  p2X = width * 0.75; 
  
  imageMode(CENTER);
  frameRate(60); 

  // --- 組合動畫幀序列 (主角) ---
  idleFrames.push({ img: sheet2, x: 0, y: 0, w: frameSize2.w, h: frameSize2.h }); 
  walkFrames.push({ img: sheet4, x: 0 * frameSize4.w, y: 0, w: frameSize4.w, h: frameSize4.h });
  walkFrames.push({ img: sheet4, x: 1 * frameSize4.w, y: 0, w: frameSize4.w, h: frameSize4.h });
  jumpFrames.push({ img: sheet3, x: 2 * frameSize3.w, y: 0, w: frameSize3.w, h: frameSize3.h }); 
  jumpFrames.push({ img: sheet3, x: 3 * frameSize3.w, y: 0, w: frameSize3.w, h: frameSize3.h }); 
  flyFrames.push({ img: sheet1, x: 0 * frameSize1.w, y: 0, w: frameSize1.w, h: frameSize1.h }); 
  flyFrames.push({ img: sheet1, x: 2 * frameSize1.w, y: 0, w: frameSize1.w, h: frameSize1.h }); 
  
  attackFramesR.push({ img: sheet6, x: 3 * frameSize6.w, y: 0, w: frameSize6.w, h: frameSize6.h }); 
  attackFramesL.push({ img: sheet5, x: 1 * frameSize5.w, y: 0, w: frameSize5.w, h: frameSize5.h }); 
  
  // --- 角色二動畫幀序列 (共 8 幀: 0-3標準, 4-6受擊, 7最終) ---
  p2Frames = [];
  
  // 0: Idle (45x52)
  p2Frames.push({ img: sheet2P, x: 0 * p2StandardSize.w, y: 0, w: p2StandardSize.w, h: p2StandardSize.h });
  
  // 1, 2, 3: Alert/Other Standard Frames (45x52)
  for (let i = 1; i <= 3; i++) {
      p2Frames.push({
        img: sheet2P,
        x: i * p2StandardSize.w,
        y: 0,
        w: p2StandardSize.w,
        h: p2StandardSize.h
      });
  }
  
  // 4: HIT 1 (48x46)
  p2Frames[P2_HIT_1_FRAME_INDEX] = { 
    img: sheet2P_hit_1, 
    x: 0, y: 0, w: p2HitSize.w, h: p2HitSize.h, isSingleFrame: true
  };
  
  // 5: HIT 2 (48x46)
  p2Frames[P2_HIT_2_FRAME_INDEX] = { 
    img: sheet2P_hit_2, 
    x: 0, y: 0, w: p2HitSize.w, h: p2HitSize.h, isSingleFrame: true
  };
  
  // 6: HIT 3 (48x46)
  p2Frames[P2_HIT_3_FRAME_INDEX] = { 
    img: sheet2P_hit_3, 
    x: 0, y: 0, w: p2HitSize.w, h: p2HitSize.h, isSingleFrame: true
  };
  
  // 7: Final/Locked Frame (假設是標準圖集的第 5 幀 - 45x52)
  p2Frames.push({ img: sheet2P, x: 4 * p2StandardSize.w, y: 0, w: p2StandardSize.w, h: p2StandardSize.h });
  
  // --- 創建輸入框 ---
  inputBox = createInput('在此輸入名字...');
  inputBox.size(inputWidth, inputHeight);
  inputBox.style('font-size', '16px');
  inputBox.style('text-align', 'center');
  inputBox.hide(); 

  // 雲朵初始化
  for (let i = 0; i < numClouds; i++) {
    clouds.push(createCloud());
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // 重新計算地面 Y 軸
  let groundHeight = height * groundRatio;
  let groundLineY = height - groundHeight;
  let charHalfHeight = maxHeight * imgScale / 2;
  
  groundY = groundLineY - charHalfHeight;
  
  // 約束主角位置
  yPos = constrain(yPos, charHalfHeight, groundY);
  xPos = constrain(xPos, charHalfHeight, width - charHalfHeight);
  
  // 約束角色二位置
  let p2HalfHeight = p2MaxHeight * imgScale / 2;
  p2Y = groundLineY - p2HalfHeight;
  p2X = constrain(p2X, p2HalfHeight, width - p2HalfHeight);
}


/**
 * 繪製迴圈 
 */
function draw() {
  // 1. 繪製背景
  let groundLineY = height - (height * groundRatio);

  imageMode(CORNER); 
  image(backgroundImg, 0, 0, width, height); 
  imageMode(CENTER); 
  
  // 1.5. 處理和繪製雲朵
  updateAndDrawClouds(); 

  // 2. 處理連擊計時器
  if (comboTimer > 0) {
      comboTimer--;
  } else if (comboCount > 0) {
      comboCount = 0;
  }
  
  // 3. 處理狀態和物理 (人物一)
  state = 'idle'; 
  isFlying = false; 

  handleKeyboardInput(); 

  if (state !== 'attack') {
    if (isFlying) {
      state = 'fly';
    } else if (isJumping || yPos < groundY) {
      state = 'jump';
    } 
  }
  
  applyPhysics();
  animateSprite();
  
  // 4. 繪製角色 (人物一)
  drawSprite();
  
  // 5. 處理和繪製 角色二 (新互動目標)
  animatePlayer2(); // 處理互動和受擊邏輯
  drawPlayer2(); // 繪製角色二

  
  // 6. 處理子彈
  moveBullets();  
  drawBullets();  
  
  // 7. 顯示文字提示 (底部狀態) 
  fill(0);
  textSize(16);
  textAlign(CENTER);
  text(`狀態: ${state.toUpperCase()} | 連擊數: ${comboCount} | P2 受擊: ${p2HitCount}/${requiredHits} | 鍵盤鎖定: ${isKeyboardLocked ? '是' : '否'}`, width / 2, groundLineY - 10);
  
  // 8. 處理對話和回覆氣泡 (現在對準角色二的位置)
  let p2CurrentHalfHeight = p2MaxHeight * imgScale / 2;
  
  // 初始對話/輸入框
  if (showDialogue) {
      let bubbleX = p2X;
      let bubbleY = p2Y - p2CurrentHalfHeight - 50; 
      
      push();
        rectMode(CENTER);
        noStroke();
        fill(255, 255, 200, 200); 
        rect(bubbleX, bubbleY, 300, 40, 10); 
        fill(0);
        textSize(16);
        textAlign(CENTER, CENTER);
        text(dialogueText, bubbleX, bubbleY);
      pop(); 

      // 輸入框提示
      let charHalfHeight = maxHeight * imgScale / 2;
      push();
        fill(0);
        textSize(14);
        textAlign(CENTER, TOP);
        text("輸入後按 [Enter] 鍵送出", xPos, yPos - charHalfHeight - inputHeight - 50);
      pop();
  }
  
  // 角色二回覆顯示 (歡迎或問答結果)
  if (p2ReplyTimer > 0) {
      p2ReplyTimer--;
      
      let replyBubbleX = p2X;
      let replyBubbleY = p2Y - p2CurrentHalfHeight - 50; 
      push();
        rectMode(CENTER);
        noStroke(); 
        fill(255, 255, 200, 200); 
        rect(replyBubbleX, replyBubbleY, 300, 40, 10); 
        fill(0);
        textSize(16);
        textAlign(CENTER, CENTER);
        text(p2ReplyText, replyBubbleX, replyBubbleY); 
      pop();
  }
    
  // 角色二最終警告對話
  if (p2FinalReplyTimer > 0) {
      p2FinalReplyTimer--;
      
      let replyBubbleX = p2X;
      let replyBubbleY = p2Y - p2CurrentHalfHeight - 50; 
      
      push();
        rectMode(CENTER);
        noStroke(); 
        fill(255, 150, 150, 200); 
        rect(replyBubbleX, replyBubbleY, 350, 40, 10); 
        fill(0);
        textSize(16);
        textAlign(CENTER, CENTER);
        text(p2FinalDialogue, replyBubbleX, replyBubbleY); 
      pop();
  }
}


function applyPhysics() {
  if (isJumping || isFlying || yPos < groundY) {
    jumpVelocity += gravity;
    
    if (isFlying) {
      jumpVelocity += upwardThrust; 
      jumpVelocity = constrain(jumpVelocity, jumpForce * 0.5, jumpVelocity);
    }

    yPos += jumpVelocity;
    
    if (yPos >= groundY) {
      yPos = groundY;          
      jumpVelocity = 0;        
      isJumping = false;       
      isFlying = false;        
    }
    
    yPos = constrain(yPos, maxHeight * imgScale / 2, yPos);
  }
}

function handleKeyboardInput() {
    if (isKeyboardLocked) {
        isFlying = false;
        return; 
    }
    
  let isMoving = false;
  
  if (keyIsDown(16)) { 
    isFlying = true;
  } else {
    isFlying = false; 
  }
  
  let currentMoveSpeed = isFlying ? moveSpeed * 1.5 : (isJumping || state === 'attack' ? moveSpeed * 0.7 : moveSpeed); 
    
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { 
        xPos -= currentMoveSpeed;
        isMoving = true;
    facingDirection = -1; 
  }
    
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { 
        xPos += currentMoveSpeed;
        isMoving = true;
    facingDirection = 1; 
  }
  
  if (keyIsDown(32) && !isJumping && !isFlying && yPos >= groundY) { 
    isJumping = true;         
    jumpVelocity = jumpForce; 
  }
  
  if (isJumping || yPos < groundY) {
    state = 'jump';
  } else if (isMoving) {
    state = 'walk';
    }
  
  let scaledW = frameSize2.w * imgScale / 2;
  xPos = constrain(xPos, scaledW, width - scaledW);
}

function animateSprite() {
  if (state !== prevState) {
    currentFrame = 0;
    prevState = state;
  }

  if (state === 'attack') {
    currentFrame = 0; 
    return; 
  }

  if (state === 'fly') {
    currentFrame = (facingDirection === 1) ? 1 : 0;
    return;
  }

  if (state === 'jump') {
    currentFrame = (jumpVelocity < 0) ? 0 : 1; 
    return;
  }
  
  if (state === 'idle') {
    currentFrame = 0;
    return;
  }

  if (state === 'walk') {
      let framesArray = walkFrames;
      if (frameCount % frameRateFactor === 0) {
          currentFrame = (currentFrame + 1) % framesArray.length;
      }
  }
}

function drawSprite() {
  let frameData = null;
  let framesArray = null;

  if (state === 'idle') {
    frameData = idleFrames[currentFrame];
  } else if (state === 'walk') {
    frameData = walkFrames[currentFrame];
  } else if (state === 'jump') {
    frameData = jumpFrames[currentFrame];
  } else if (state === 'fly') { 
    frameData = flyFrames[currentFrame]; 
  } else if (state === 'attack') { 
    if (facingDirection === 1) { 
      framesArray = attackFramesR;
    } else {                  
      framesArray = attackFramesL;
    }
    frameData = framesArray[0]; 
  }

  if (!frameData || !frameData.img) return; 

  push();
    translate(xPos, yPos);

    if (state !== 'fly' && state !== 'attack') {
      scale(facingDirection, 1);
    }

    image(
      frameData.img,
      0, 0,
      frameData.w * imgScale, 
      frameData.h * imgScale,
      frameData.x, frameData.y,
      frameData.w, frameData.h
    );
  pop();
}

function mousePressed() {
    if (mouseButton === LEFT && !isKeyboardLocked) {
        
        if (comboTimer <= 0) {
            comboCount = 0; 
        }

        comboCount = (comboCount % 3) + 1; 

        state = 'attack'; 
        comboTimer = comboResetDelay; 

        createBullet(xPos, yPos, facingDirection); 
    }
}


function keyPressed() {
    // 處理輸入框送出邏輯
    if (showDialogue && keyCode === 13) {
    let valRaw = inputBox.value().trim();
    if (isAwaitingAnswer && currentQuestion) {
        // 判斷答案
        let playerAnswerUpper = valRaw.toUpperCase();
        let correctAnswer = currentQuestion.answer.toUpperCase();
        const questionCopy = currentQuestion; 
        
        // 重設狀態 (回答完畢)
        isAwaitingAnswer = false;
        currentQuestion = null; // 關鍵：清除當前問題，允許下次靠近時發起新問題
        inputBox.value('');
        inputBox.hide();
        showDialogue = false;
        isKeyboardLocked = false; // 關鍵：解鎖鍵盤，允許主角移動離開
        
        // 檢查關鍵字或選項
        const keywordMatch = questionCopy.keywords && questionCopy.keywords.some(k => {
            if (!k) return false;
            return playerAnswerUpper.includes(k.toUpperCase()) || valRaw.includes(k);
        });
        if (playerAnswerUpper === correctAnswer || keywordMatch) {
            p2ReplyText = "恭喜你！回答正確！\n勇者大人果然知識淵博！";
            p2ReplyTimer = p2ReplyDuration;
        } else {
            p2ReplyText = `回答錯誤！正確答案是：${correctAnswer}！\n請努力學習！`;
            p2ReplyTimer = p2ReplyDuration;
        }
        return false;
    } else {
        // 原有名字輸入行為
        if (valRaw !== "") {
            playerInputName = valRaw;
            isNameEntered = true;
            p2ReplyText = `${playerInputName} 勇士歡迎您的到來！！！`;
            p2ReplyTimer = p2ReplyDuration;
            inputBox.value('');
            inputBox.hide();
            showDialogue = false;
            isKeyboardLocked = false; // 解鎖鍵盤
        }
        return false;
    }
}
}

// --- 子彈相關函式 ---

function createBullet(startX, startY, direction) {
  let bulletImgToUse;
  let offsetX; 

  if (direction === 1) { 
    bulletImgToUse = bulletImgR;
    offsetX = frameSize6.w * imgScale * 0.4; 
  } else { 
    bulletImgToUse = bulletImgL;
    offsetX = -frameSize5.w * imgScale * 0.4; 
  }
  
  let offsetY = -frameSize6.h * imgScale * 0.1; 
  
  let newBullet = {
    x: startX + offsetX,
    y: startY + offsetY,
    dir: direction,
    w: bulletSize.w * imgScale,
    h: bulletSize.h * imgScale,
    img: bulletImgToUse, 
  };
  bullets.push(newBullet);
}

function moveBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    b.x += b.dir * bulletSpeed;
    
    // --- 檢查子彈與 角色二 的碰撞 ---
    let p2CollisionW = p2HitSize.w * imgScale;
    let p2CollisionH = p2HitSize.h * imgScale;
    
    let p2Left = p2X - p2CollisionW / 2;
    let p2Right = p2X + p2CollisionW / 2;
    let p2Top = p2Y - p2CollisionH / 2;
    let p2Bottom = p2Y + p2CollisionH / 2;


    if (b.x > p2Left && b.x < p2Right && 
        b.y > p2Top && b.y < p2Bottom) {
        
        bullets.splice(i, 1); 
        
        if (!isP2LockedOnFinalFrame) {
            p2HitCount++; 
            
            if (p2HitCount === requiredHits) {
                p2State = 'hit_3';
                hitTimer = hitFrameDuration;  
                p2FinalReplyTimer = p2FinalReplyDuration; 
            } else if (p2HitCount === 2) {
                p2State = 'hit_2';
                hitTimer = 30; 
            } else if (p2HitCount === 1) {
                p2State = 'hit_1';
                hitTimer = 30; 
            }
        }
        continue; 
    }
    
    if (b.x < -b.w || b.x > width + b.w) {
      bullets.splice(i, 1); 
    }
  }
}

function drawBullets() {
  push();
  for (let b of bullets) {
    push();
    translate(b.x, b.y);
    image(b.img, 0, 0, b.w, b.h);
    pop();
  }
  pop();
}


// --- 角色二 (Player 2) 相關函式 ---

/**
 * 處理角色二的動畫、互動和受擊邏輯
 */
function animatePlayer2() {
    let distToP1 = abs(xPos - p2X);
    
    // ------------------------------------
    // A. 互動 (鍵盤鎖定和對話顯示)
    // ------------------------------------
    
    if (distToP1 < P2_INTERACTION_DISTANCE) {
        
        // 關鍵：判斷 P2 是否處於最終鎖定狀態並執行重設
        if (p2State === 'final' || isP2LockedOnFinalFrame) {
            // 重設所有相關狀態
            p2State = 'idle';
            isP2LockedOnFinalFrame = false;
            p2HitCount = 0; 
            p2FinalReplyTimer = 0; 
            
            p2ReplyText = "（鎖定已解除，角色二恢復正常...）";
            p2ReplyTimer = 90; // 稍微短一點的回覆
            
            // 解除所有互動控制
            isKeyboardLocked = false;
            inputBox.hide();
            showDialogue = false;
            isAwaitingAnswer = false;
            currentQuestion = null;
            return; // 重設完畢，本幀不做其他互動處理
        }
        // **************************************************

        if (!isNameEntered) {
            // 1. 未輸入名字：鎖定鍵盤，要求輸入名字
            showDialogue = true;
            inputBox.show();
            isKeyboardLocked = true;
            let charHalfHeight = maxHeight * imgScale / 2;
            inputBox.position(xPos - inputWidth / 2, yPos - charHalfHeight - inputHeight - 50);
        } else {
            // 2. 已輸入名字：若沒有在等待回答、回覆計時器結束 且沒有當前問題，則出題
            // 關鍵檢查： currentQuestion == null (上次問題已回答完畢)
            if (!isAwaitingAnswer && p2ReplyTimer <= 0 && currentQuestion == null) {
                if (quizData.length > 0) {
                    // 隨機選一個新問題
                    currentQuestion = quizData[floor(random(quizData.length))];
                    
                    if (currentQuestion && currentQuestion.question) {
                        dialogueText = `勇士 ${playerInputName}，請回答：\n${currentQuestion.question}`;
                        isAwaitingAnswer = true;
                        showDialogue = true;
                        inputBox.value('');
                        inputBox.show();
                        isKeyboardLocked = true;
                        let charHalfHeight = maxHeight * imgScale / 2;
                        inputBox.position(xPos - inputWidth / 2, yPos - charHalfHeight - inputHeight - 50);
                    }
                }
            }
        }
    } else {
        // 超出互動範圍時，強制恢復正常狀態
        if (isKeyboardLocked && !isAwaitingAnswer) {
            // 只有當不是在回答問題時，離開才解除鎖定 (例如剛輸入完名字)
            isKeyboardLocked = false;
            inputBox.hide();
            showDialogue = false;
        }
    }
    
    // ------------------------------------
    // B. 受擊和鎖定邏輯 (保持不變)
    // ------------------------------------
    
    if (hitTimer > 0) {
        hitTimer--;
        
        if (hitTimer <= 0 && p2HitCount >= requiredHits) {
            isP2LockedOnFinalFrame = true;
            p2State = 'final';
        }
        
    } else {
        // 受擊動畫結束，根據擊中次數調整 P2 狀態
        
        if (p2HitCount === 0) {
            p2State = 'idle';
        } else if (p2HitCount === 1) {
            p2State = 'hit_1';
        } else if (p2HitCount === 2) {
            p2State = 'hit_2';
        } else if (p2HitCount >= 3) {
            isP2LockedOnFinalFrame = true;
            p2State = 'final'; 
        }
    }
}


/**
 * 根據 P2 當前狀態繪製正確的動畫幀，並固定待機動畫幀。
 */
function drawPlayer2() {
    let frameIndex;
    
    // 檢查受擊和最終狀態
    if (p2State === 'hit_1') {
        frameIndex = P2_HIT_1_FRAME_INDEX;
    } else if (p2State === 'hit_2') {
        frameIndex = P2_HIT_2_FRAME_INDEX;
    } else if (p2State === 'hit_3' || p2State === 'final') {
        frameIndex = P2_HIT_3_FRAME_INDEX;
    } else {
        // *** 修正點：非受擊狀態下，固定使用待機第一幀 (索引 0) ***
        frameIndex = 0; 
    }

    let frameData = p2Frames[frameIndex];

    if (!frameData || !frameData.img) return;

    let drawW = frameData.w * imgScale;
    let drawH = frameData.h * imgScale;

    // 由於受擊圖片 (46h) 比標準圖片 (52h) 矮，計算 Y 軸偏移量以確保腳部對齊地面
    let yOffset = (p2StandardSize.h - frameData.h) * imgScale / 2;
    
    push();
    image(
        frameData.img,
        p2X, p2Y + yOffset, 
        drawW,
        drawH,
        frameData.x, frameData.y,
        frameData.w, frameData.h
    );
    pop();
}


// --- 問答題庫相關函式 ---

function fillQuizData() {
  quizData = [
    {
      question: "地球上最大的陸地面積是哪一個大陸？\n(A) 非洲  (B) 亞洲  (C) 歐洲  (D) 北美洲",
      answer: "B",
      keywords: ["亞洲"]
    },
    {
      question: "水的化學式是什麼？\n(A) H2O  (B) CO2  (C) O2  (D) H2SO4",
      answer: "A",
      keywords: ["H2O", "h2o"]
    },
    {
      question: "哪一位科學家提出了相對論？\n(A) 艾薩克·牛頓  (B) 亞歷山大·弗萊明  (C) 阿爾伯特·愛因斯坦  (D) 伽利略",
      answer: "C",
      keywords: ["阿爾伯特·愛因斯坦", "愛因斯坦"]
    },
    {
      question: "世界上最長的河流是哪一條？\n(A) 長江  (B) 亞馬遜河  (C) 尼羅河  (D) 密西西比河",
      answer: "C",
      keywords: ["尼羅河", "亞馬遜河"]
    },
    {
      question: "人類登上月球的首次任務是哪一年？\n(A) 1963年  (B) 1969年  (C) 1972年  (D) 1980年",
      answer: "B",
      keywords: ["1969", "1969年"]
    }
  ];
}

/**
 * 創建一個新的雲朵物件
 */
function createCloud() {
  return {
    x: random(width), 
    y: random(height * 0.1, height * 0.4), 
    w: random(50, 150), 
    h: random(20, 60), 
    speed: random(cloudSpeed * 0.5, cloudSpeed * 1.5) 
  };
}

/**
 * 更新並繪製雲朵
 */
function updateAndDrawClouds() {
  push();
  fill(255, 255, 255, 180); 
  noStroke();
  
  for (let i = clouds.length - 1; i >= 0; i--) {
    let c = clouds[i];
    
    c.x += c.speed;
    
    ellipse(c.x, c.y, c.w, c.h);
    ellipse(c.x + c.w * 0.2, c.y + c.h * 0.2, c.w * 0.7, c.h * 0.7);
    ellipse(c.x - c.w * 0.2, c.y - c.h * 0.2, c.w * 0.8, c.h * 0.8);

    if (c.speed > 0 && c.x > width + c.w / 2) {
      c.x = -c.w / 2;
      c.y = random(height * 0.1, height * 0.4);
    } else if (c.speed < 0 && c.x < -c.w / 2) {
      c.x = width + c.w / 2;
      c.y = random(height * 0.1, height * 0.4);
    }
  }
  pop();
}