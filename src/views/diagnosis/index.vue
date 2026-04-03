<template>
  <div class="image-viewer-container">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-button-group>
          <el-button type="primary" @click="uploadLeftImage">
            <el-icon><Upload /></el-icon>
            上传图像
          </el-button>
        </el-button-group>
        
        <el-button-group class="ml-4">
          <el-button @click="zoomIn">
            <el-icon><ZoomIn /></el-icon>
            放大
          </el-button>
          <el-button @click="zoomOut">
            <el-icon><ZoomOut /></el-icon>
            缩小
          </el-button>
          <el-button @click="resetZoom">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-button-group>

        <el-button-group class="ml-4">
          <el-button :type="drawMode === 'none' ? 'primary' : ''" @click="setDrawMode('none')">
            <el-icon><Pointer /></el-icon>
            选择
          </el-button>
          <el-button :type="drawMode === 'circle' ? 'primary' : ''" @click="setDrawMode('circle')">
            <el-icon><CircleCheck /></el-icon>
            圆形
          </el-button>
          <el-button :type="drawMode === 'rectangle' ? 'primary' : ''" @click="setDrawMode('rectangle')">
            <el-icon><Select /></el-icon>
            矩形
          </el-button>
          <el-button :type="drawMode === 'text' ? 'primary' : ''" @click="setDrawMode('text')">
            <el-icon><EditPen /></el-icon>
            文字
          </el-button>
          <el-button @click="clearAnnotations">
            <el-icon><Delete /></el-icon>
            消除标注
          </el-button>
        </el-button-group>
        
        <div class="ml-4">
          <span class="config-label-small">标注颜色:</span>
          <el-color-picker v-model="annotationColor" show-alpha />
        </div>
        
        <div class="ml-4">
          <span class="config-label-small">线条粗细:</span>
          <el-slider
            v-model="lineWidth"
            :min="1"
            :max="10"
            :step="1"
            style="width: 80px; margin: 0px 6px;"
          />
        </div>
      </div>

      <div class="toolbar-right">
        <el-button type="info" @click="resetZoom">
          <el-icon><Refresh /></el-icon>
          重置视图
        </el-button>
      </div>
    </div>

    <!-- 模型和硬件选择区域 -->
    <div class="config-panel">
      <div class="config-item">
        <span class="config-label">图像增强模型:</span>
        <el-select v-model="enhancementModel" placeholder="选择模型">
          <el-option label="模型1" value="model1" />
          <el-option label="模型2" value="model2" />
          <el-option label="模型3" value="model3" />
        </el-select>
      </div>
      
      <div class="config-item">
        <span class="config-label">糖网诊断模型:</span>
        <el-select v-model="diagnosisModel" placeholder="选择模型">
          <el-option label="模型1" value="model1" />
        </el-select>
      </div>
      
      <div class="config-item">
        <span class="config-label">硬件选择:</span>
        <el-radio-group v-model="hardware">
          <el-radio label="gpu">GPU</el-radio>
          <el-radio label="cpu">CPU</el-radio>
        </el-radio-group>
      </div>
      
      <div class="config-item">
          <el-button type="warning" @click="startEnhancement" :loading="enhancing" :disabled="!leftImageLoaded">
            <el-icon><Tools /></el-icon>
            图像增强
          </el-button>
        </div>
        <div class="config-item">
          <el-button type="primary" @click="runDiagnosis" :loading="diagnosing" :disabled="!leftImageLoaded">
            <el-icon><Document /></el-icon>
            AI 诊断
          </el-button>
        </div>
        <div class="config-item">
          <el-button type="success" @click="showDiagnosisResult" :disabled="!leftImageLoaded">
            <el-icon><Document /></el-icon>
            诊断结果
          </el-button>
        </div>
    </div>

    <!-- 双视图区域 -->
    <div class="viewer-container">
      <!-- 左侧视图 -->
      <div class="image-viewer left-viewer">
        <div class="viewer-header">原始图像</div>
        <div 
          class="image-container" 
          ref="leftImageContainer"
          @mousedown="startDrag($event, 'left')"
          @mousemove="drag($event, 'left')"
          @mouseup="endDrag"
          @mouseleave="endDrag"
          @wheel="handleZoom($event, 'left')"
        >
          <canvas 
            ref="leftCanvas" 
            class="image-canvas"
            @mousedown="startDrawing($event, 'left')"
            @mousemove="draw($event, 'left')"
            @mouseup="endDrawing($event, 'left')"
          ></canvas>
          <div v-if="!leftImageLoaded" class="image-placeholder">
            <el-icon><Picture /></el-icon>
          </div>
        </div>
      </div>

      <!-- 右侧视图 -->
      <div class="image-viewer right-viewer">
        <div class="viewer-header">增强图像</div>
        <div 
          class="image-container" 
          ref="rightImageContainer"
          @mousedown="startDrag($event, 'right')"
          @mousemove="drag($event, 'right')"
          @mouseup="endDrag"
          @mouseleave="endDrag"
          @wheel="handleZoom($event, 'right')"
        >
          <canvas 
            ref="rightCanvas" 
            class="image-canvas"
            @mousedown="startDrawing($event, 'right')"
            @mousemove="draw($event, 'right')"
            @mouseup="endDrawing($event, 'right')"
          ></canvas>
          <div v-if="!rightImageLoaded" class="image-placeholder">
            <el-icon><Picture /></el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 诊断结果抽屉 -->
    <el-drawer
      v-model="diagnosisDrawerVisible"
      title="诊断结果"
      direction="rtl"
      size="40%"
    >
      <div class="diagnosis-content">
        <el-divider content-position="left">AI诊断结果</el-divider>
        <div class="ai-result">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="糖网分级">
              {{ aiResult.level || '暂无结果' }}
            </el-descriptions-item>
            <el-descriptions-item label="置信度">
              {{ aiResult.confidence || '暂无结果' }}
            </el-descriptions-item>
            <el-descriptions-item label="病灶区域">
              {{ aiResult.lesions || '暂无结果' }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <el-divider content-position="left">医生诊断意见</el-divider>
        <div class="doctor-result">
          <el-form :model="doctorResult" label-width="100px">
            <el-form-item label="糖网分级">
              <el-select v-model="doctorResult.level" placeholder="请选择">
                <el-option label="无糖网" value="0" />
                <el-option label="轻度糖网" value="1" />
                <el-option label="中度糖网" value="2" />
                <el-option label="重度糖网" value="3" />
                <el-option label="增殖性糖网" value="4" />
              </el-select>
            </el-form-item>
            <el-form-item label="诊断意见">
              <el-input 
                v-model="doctorResult.opinion" 
                type="textarea" 
                :rows="4"
                placeholder="请输入诊断意见"
              ></el-input>
            </el-form-item>
            <el-form-item label="建议">
              <el-input 
                v-model="doctorResult.suggestion" 
                type="textarea" 
                :rows="3"
                placeholder="请输入治疗建议"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveDiagnosis">保存诊断</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-drawer>

    <!-- 底部操作区域 -->
    <div class="bottom-action-section">
      <el-button type="primary" @click="goToUpload" class="upload-btn">
        上传医学数据
      </el-button>
    </div>

    <!-- 隐藏的文件输入 -->
    <input 
      ref="leftFileInput" 
      type="file" 
      accept="image/*" 
      style="display: none" 
      @change="handleLeftImageUpload"
    >
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Upload, ZoomIn, ZoomOut, Refresh, Pointer, 
  CircleCheck, Select, EditPen, Cpu, Document, Picture, Delete, Tools
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

const goToUpload = () => {
  router.push('/upload')
}

// 画布引用
const leftCanvas = ref(null)
const rightCanvas = ref(null)
const leftImageContainer = ref(null)
const rightImageContainer = ref(null)

// 文件输入引用
const leftFileInput = ref(null)

// 图像状态
const leftImageLoaded = ref(false)
const rightImageLoaded = ref(false)
const leftImage = ref(null)
const rightImage = ref(null)

// 缩放和平移状态
const leftZoom = ref(1)
const rightZoom = ref(1)
const leftPosition = ref({ x: 0, y: 0 })
const rightPosition = ref({ x: 0, y: 0 })

// 拖动状态
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const dragStartPos = ref({ x: 0, y: 0 })

// 绘图状态
const drawMode = ref('none') // none, circle, rectangle, text
const isDrawing = ref(false)
const drawStart = ref({ x: 0, y: 0 })
const annotationColor = ref('#ff0000') // 标注颜色
const lineWidth = ref(2) // 线条粗细
const annotations = reactive({
  left: [],
  right: []
})

// 模型和硬件配置
const enhancementModel = ref('model1')
const diagnosisModel = ref('model1')
const hardware = ref('gpu')

// 诊断相关
const diagnosing = ref(false)
const enhancing = ref(false)
const diagnosisDrawerVisible = ref(false)
const aiResult = reactive({
  level: '',
  confidence: '',
  lesions: ''
})
const doctorResult = reactive({
  level: '',
  opinion: '',
  suggestion: ''
})

// 初始化画布
onMounted(() => {
  initCanvas()
})

// 初始化画布
const initCanvas = () => {
  nextTick(() => {
    if (leftCanvas.value) {
      const ctx = leftCanvas.value.getContext('2d')
      leftCanvas.value.width = leftCanvas.value.offsetWidth
      leftCanvas.value.height = leftCanvas.value.offsetHeight
    }
    
    if (rightCanvas.value) {
      const ctx = rightCanvas.value.getContext('2d')
      rightCanvas.value.width = rightCanvas.value.offsetWidth
      rightCanvas.value.height = rightCanvas.value.offsetHeight
    }
  })
}

// 上传图像
const uploadLeftImage = () => {
  leftFileInput.value.click()
}

// 处理左图上传
const handleLeftImageUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        leftImage.value = img
        leftImageLoaded.value = true
        drawImage('left')
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }
}

// 绘制图像
const drawImage = (side) => {
  const canvas = side === 'left' ? leftCanvas.value : rightCanvas.value
  const ctx = canvas.getContext('2d')
  const image = side === 'left' ? leftImage.value : rightImage.value
  const zoom = side === 'left' ? leftZoom.value : rightZoom.value
  const position = side === 'left' ? leftPosition.value : rightPosition.value
  
  if (!image) return
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 保存当前状态
  ctx.save()
  
  // 应用变换
  ctx.translate(position.x, position.y)
  ctx.scale(zoom, zoom)
  
  // 绘制图像
  const scale = Math.min(
    canvas.width / image.width,
    canvas.height / image.height
  )
  const x = (canvas.width / scale - image.width) / 2
  const y = (canvas.height / scale - image.height) / 2
  
  ctx.scale(scale, scale); // 应用缩放比例
  ctx.drawImage(image, x, y)  // 绘制图像
  
  ctx.restore()  // 恢复画布状态

  drawAnnotations(side)  // 绘制标注
}

// 绘制标注
const drawAnnotations = (side) => {
  const canvas = side === 'left' ? leftCanvas.value : rightCanvas.value
  const ctx = canvas.getContext('2d')
  const image = side === 'left' ? leftImage.value : rightImage.value
  const zoom = side === 'left' ? leftZoom.value : rightZoom.value
  const position = side === 'left' ? leftPosition.value : rightPosition.value
  
  if (!image) return
  
  ctx.save()
  ctx.translate(position.x, position.y)
  ctx.scale(zoom, zoom)
  
  // 计算图像居中偏移量
  const scale = Math.min(
    canvas.width / image.width,
    canvas.height / image.height
  )
  const offsetX = (canvas.width / scale - image.width) / 2
  const offsetY = (canvas.height / scale - image.height) / 2
  
  // 确定要绘制的标注数组
  let annotationsToDraw = []
  if (side === 'left') {
    annotationsToDraw = annotations.left
  } else {
    // 右侧图像显示左侧的标注（同步显示）
    annotationsToDraw = annotations.left
  }
  
  annotationsToDraw.forEach(annotation => {
    ctx.strokeStyle = annotation.color || '#ff0000'
    ctx.lineWidth = (annotation.lineWidth || 2) / zoom
    
    if (annotation.type === 'circle') {
      ctx.beginPath()
      ctx.arc(annotation.x + offsetX, annotation.y + offsetY, annotation.radius, 0, 2 * Math.PI)
      ctx.stroke()
    } else if (annotation.type === 'rectangle') {
      ctx.beginPath()
      ctx.rect(annotation.x + offsetX, annotation.y + offsetY, annotation.width, annotation.height)
      ctx.stroke()
    } else if (annotation.type === 'text') {
      ctx.fillStyle = annotation.color || '#ff0000'
      ctx.font = `${16 / zoom}px Arial`
      ctx.fillText(annotation.text, annotation.x + offsetX, annotation.y + offsetY)
    }
  })
  
  ctx.restore()
}

// 缩放功能
const zoomIn = () => {
  leftZoom.value = Math.min(leftZoom.value * 1.2, 5)
  rightZoom.value = Math.min(rightZoom.value * 1.2, 5)
  drawImage('left')
  drawImage('right')
}

const zoomOut = () => {
  leftZoom.value = Math.max(leftZoom.value / 1.2, 0.1)
  rightZoom.value = Math.max(rightZoom.value / 1.2, 0.1)
  drawImage('left')
  drawImage('right')
}

const resetZoom = () => {
  leftZoom.value = 1
  rightZoom.value = 1
  leftPosition.value = { x: 0, y: 0 }
  rightPosition.value = { x: 0, y: 0 }
  // 清除所有标注
  annotations.left = []
  annotations.right = []
  drawImage('left')
  drawImage('right')
  ElMessage.success('视图已重置')
}

// 处理滚轮缩放
const handleZoom = (e, side) => {
  e.preventDefault()
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  
  if (side === 'left') {
    leftZoom.value = Math.max(0.1, Math.min(leftZoom.value * delta, 5))
    // 左侧缩放时，右侧图像同步缩放
    rightZoom.value = leftZoom.value
  } else {
    rightZoom.value = Math.max(0.1, Math.min(rightZoom.value * delta, 5))
  }
  
  drawImage('left')
  drawImage('right')
}

// 拖动功能
const startDrag = (e, side) => {
  if (drawMode.value !== 'none') return
  
  isDragging.value = true
  dragStart.value = { x: e.clientX, y: e.clientY }
  
  if (side === 'left') {
    dragStartPos.value = { ...leftPosition.value }
  } else {
    dragStartPos.value = { ...rightPosition.value }
  }
}

const drag = (e, side) => {
  if (!isDragging.value || drawMode.value !== 'none') return
  
  const dx = e.clientX - dragStart.value.x
  const dy = e.clientY - dragStart.value.y
  
  if (side === 'left') {
    leftPosition.value = {
      x: dragStartPos.value.x + dx,
      y: dragStartPos.value.y + dy
    }
    // 左侧拖动时，右侧图像同步移动
    rightPosition.value = {
      x: dragStartPos.value.x + dx,
      y: dragStartPos.value.y + dy
    }
  } else {
    rightPosition.value = {
      x: dragStartPos.value.x + dx,
      y: dragStartPos.value.y + dy
    }
  }
  
  drawImage('left')
  drawImage('right')
}

const endDrag = () => {
  isDragging.value = false
}

// 绘图功能
const setDrawMode = (mode) => {
  drawMode.value = mode
}

const startDrawing = (e, side) => {
  if (drawMode.value === 'none') return
  
  isDrawing.value = true
  const canvas = side === 'left' ? leftCanvas.value : rightCanvas.value
  const image = side === 'left' ? leftImage.value : rightImage.value
  const rect = canvas.getBoundingClientRect()
  const zoom = side === 'left' ? leftZoom.value : rightZoom.value
  const position = side === 'left' ? leftPosition.value : rightPosition.value
  
  if (!image) return
  
  // 计算图像居中偏移量
  const scale = Math.min(
    canvas.width / image.width,
    canvas.height / image.height
  )
  const offsetX = (canvas.width / scale - image.width) / 2
  const offsetY = (canvas.height / scale - image.height) / 2
  
  drawStart.value = {
    x: (e.clientX - rect.left - position.x) / zoom - offsetX,
    y: (e.clientY - rect.top - position.y) / zoom - offsetY
  }
  
  if (drawMode.value === 'text') {
    // 创建文本输入框
    const textInput = document.createElement('textarea')
    textInput.placeholder = '请输入标注文字'
    textInput.style.position = 'absolute'
    textInput.style.left = `${e.clientX}px`
    textInput.style.top = `${e.clientY}px`
    textInput.style.zIndex = '1000'
    textInput.style.padding = '5px'
    textInput.style.border = `1px solid ${annotationColor.value}`
    textInput.style.borderRadius = '4px'
    textInput.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
    textInput.style.color = annotationColor.value
    textInput.style.minWidth = '200px'
    textInput.style.minHeight = '50px'
    textInput.style.resize = 'none'
    textInput.style.outline = 'none'
    textInput.style.fontSize = '14px'
    
    document.body.appendChild(textInput)
    textInput.focus()
    
    const saveText = () => {
      const text = textInput.value.trim()
      if (text) {
        const annotation = {
          type: 'text',
          x: drawStart.value.x,
          y: drawStart.value.y,
          text: text,
          color: annotationColor.value
        }
        
        if (side === 'left') {
          annotations.left.push(annotation)
        } else {
          annotations.right.push(annotation)
        }
        
        drawImage(side)
      }
      document.body.removeChild(textInput)
    }
    
    textInput.addEventListener('blur', saveText)
    textInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        saveText()
      }
    })
    
    isDrawing.value = false
  }
}

const draw = (e, side) => {
  if (!isDrawing.value || drawMode.value === 'none' || drawMode.value === 'text') return
  
  const canvas = side === 'left' ? leftCanvas.value : rightCanvas.value
  const ctx = canvas.getContext('2d')
  const image = side === 'left' ? leftImage.value : rightImage.value
  const rect = canvas.getBoundingClientRect()
  const zoom = side === 'left' ? leftZoom.value : rightZoom.value
  const position = side === 'left' ? leftPosition.value : rightPosition.value
  
  if (!image) return
  
  const currentX = (e.clientX - rect.left - position.x) / zoom
  const currentY = (e.clientY - rect.top - position.y) / zoom
  
  // 重绘图像和已有标注
  drawImage(side)
  
  // 绘制当前标注
  ctx.save()
  ctx.translate(position.x, position.y)
  ctx.scale(zoom, zoom)
  
  // 计算图像居中偏移量
  const scale = Math.min(
    canvas.width / image.width,
    canvas.height / image.height
  )
  const offsetX = (canvas.width / scale - image.width) / 2
  const offsetY = (canvas.height / scale - image.height) / 2
  
  ctx.strokeStyle = annotationColor.value
  ctx.lineWidth = lineWidth.value / zoom
  
  if (drawMode.value === 'circle') {
    const radius = Math.sqrt(
      Math.pow(currentX - drawStart.value.x, 2) + 
      Math.pow(currentY - drawStart.value.y, 2)
    )
    ctx.beginPath()
    ctx.arc(drawStart.value.x + offsetX, drawStart.value.y + offsetY, radius, 0, 2 * Math.PI)
    ctx.stroke()
  } else if (drawMode.value === 'rectangle') {
    ctx.beginPath()
    ctx.rect(
      drawStart.value.x + offsetX,
      drawStart.value.y + offsetY,
      currentX - drawStart.value.x,
      currentY - drawStart.value.y
    )
    ctx.stroke()
  }
  
  ctx.restore()
}

const endDrawing = (e, side) => {
  if (!isDrawing.value || drawMode.value === 'none' || drawMode.value === 'text') return
  
  const canvas = side === 'left' ? leftCanvas.value : rightCanvas.value
  const rect = canvas.getBoundingClientRect()
  const zoom = side === 'left' ? leftZoom.value : rightZoom.value
  const position = side === 'left' ? leftPosition.value : rightPosition.value
  
  const currentX = (e.clientX - rect.left - position.x) / zoom
  const currentY = (e.clientY - rect.top - position.y) / zoom
  
  let annotation = null
  
  if (drawMode.value === 'circle') {
    const radius = Math.sqrt(
      Math.pow(currentX - drawStart.value.x, 2) + 
      Math.pow(currentY - drawStart.value.y, 2)
    )
    annotation = {
      type: 'circle',
      x: drawStart.value.x,
      y: drawStart.value.y,
      radius: radius,
      color: annotationColor.value,
      lineWidth: lineWidth.value
    }
  } else if (drawMode.value === 'rectangle') {
    annotation = {
      type: 'rectangle',
      x: drawStart.value.x,
      y: drawStart.value.y,
      width: currentX - drawStart.value.x,
      height: currentY - drawStart.value.y,
      color: annotationColor.value,
      lineWidth: lineWidth.value
    }
  }
  
  if (annotation) {
    if (side === 'left') {
      annotations.left.push(annotation)
    } else {
      annotations.right.push(annotation)
    }
  }
  
  isDrawing.value = false
  drawImage(side)
  // 如果在左侧绘制，同时更新右侧图像以保持同步
  if (side === 'left') {
    drawImage('right')
  }
}

// 运行诊断
const runDiagnosis = () => {
  if (!leftImageLoaded.value && !rightImageLoaded.value) {
    ElMessage.warning('请先上传图像')
    return
  }
  
  diagnosing.value = true
  
  // 模拟诊断过程
  setTimeout(() => {
    // 模拟AI诊断结果
    aiResult.level = '轻度糖网'
    aiResult.confidence = '78%'
    aiResult.lesions = '出血点、硬性渗出物'
    
    diagnosing.value = false
    ElMessage.success('诊断完成')
    
    // 自动显示诊断结果
    diagnosisDrawerVisible.value = true
  }, 3000)
}

// 显示诊断结果
const showDiagnosisResult = () => {
  diagnosisDrawerVisible.value = true
}

// 消除标注
const clearAnnotations = () => {
  annotations.left = []
  annotations.right = []
  drawImage('left')
  drawImage('right')
  ElMessage.success('已清除所有标注')
}

// 图像增强
const startEnhancement = () => {
  if (!leftImageLoaded.value) {
    ElMessage.warning('请先上传图像')
    return
  }
  
  enhancing.value = true
  
  // 模拟图像增强过程，延迟3秒
  setTimeout(() => {
    enhancing.value = false
    
    // 根据选择的模型加载指定路径的图像
    let imagePath = ''
    switch (enhancementModel.value) {
      case 'model1':
        imagePath = '../algorithm/output/m1/1.png'
        break
      case 'model2':
        imagePath = '../algorithm/output/m2/1.png'
        break
      case 'model3':
        imagePath = '../algorithm/output/m3/1.png'
        break
      default:
        imagePath = '../algorithm/output/m1/1.png'
    }
    
    // 加载图像到右侧视图
    const img = new Image()
    img.onload = () => {
      rightImage.value = img
      rightImageLoaded.value = true
      // 重置左右两侧图像位置和大小
      leftZoom.value = 1
      leftPosition.value = { x: 0, y: 0 }
      rightZoom.value = 1
      rightPosition.value = { x: 0, y: 0 }
      drawImage('left')
      drawImage('right')
      ElMessage.success('图像增强完成')
    }
    img.onerror = () => {
      ElMessage.error('图像加载失败')
    }
    img.src = imagePath
  }, 3000)
}

// 保存诊断
const saveDiagnosis = () => {
  ElMessage.success('诊断结果已保存')
}
</script>

<style scoped>
.image-viewer-container {
  display: flex;
  flex-direction: column;
  height: 88vh;
  background-color: #f5f5f5;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toolbar-left {
  display: flex;
  align-items: center;
}

.ml-4 {
  margin-left: 8px;
}

.upload-btn {
  font-size: 1rem;
  padding: 10px 20px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s;
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.config-panel {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
}

.config-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.config-label {
  font-size: 16px;
  margin-right: 8px;
  font-weight: bold;
}
.config-label-small {
  font-size: 16px;
  margin-right: 8px;
  font-weight: bold;
  margin: 0px 2px;
}

.viewer-container {
  display: flex;
  height: 70vh;  /*固定高度为视口（浏览器可视区域）高度的 70%*/
  max-width: 95vw;  /*最大宽度为视口宽度的 95%*/
  padding: 20px;  /*内边距为 20px*/
  gap: 30px;  /*元素间距为 30px*/
  margin: 0 auto;
  justify-content: center;
}

.image-viewer {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;  /*隐藏超出部分*/
  min-height: 60vh;
  min-width: 60vh;
}

.image-viewer .viewer-header {
  background-color: #f5f7fa;
  text-align: center;
  font-weight: bold;
  border-bottom: 1px solid #ebeef5;
  padding: 8px;
}

.image-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-canvas {
  width: 100%;
  height: 100%;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #909399;
}

.image-placeholder .el-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.diagnosis-content {
  padding: 20px;
}

.ai-result, .doctor-result {
  margin-bottom: 20px;
}

.bottom-action-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-top: 1px solid #ebeef5;
  margin-top: auto;
}
</style>