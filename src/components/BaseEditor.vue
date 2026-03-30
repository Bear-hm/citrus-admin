<template>
  <div>
    <!-- <div>
      <button @click="insertText">insert text</button>
      <button @click="printHtml">print html</button>
      <button @click="disable">disable</button>
    </div> -->
    <div style="border: 1px solid #ccc; margin-top: 10px">
      <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
        style="border-bottom: 1px solid #ccc"
      />
      <!-- :value="props.modelValue" -->
      <Editor
        :defaultConfig="editorConfig"
        :mode="mode"
        v-model="props.modelValue"
        style="height: 500px; overflow-y: hidden"
        @onCreated="handleCreated"
        @onChange="handleChange"
        @onDestroyed="handleDestroyed"
        @onFocus="handleFocus"
        @onBlur="handleBlur"
        @customAlert="customAlert"
        @customPaste="customPaste"
      />
    </div>
    <!-- <div style="margin-top: 10px">
      <textarea
        v-model="props.modelValue"
        readonly
        style="width: 100%; height: 200px; outline: none"
      ></textarea>
    </div> -->
  </div>
</template>

<script setup>
import { watch } from "vue";
import { onBeforeUnmount, ref, shallowRef, onMounted } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css";
// 新增 props 定义
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  readonly: {
    // 接收只读属性
    type: Boolean,
    default: false,
  },
});

// 新增 emit 定义
const emit = defineEmits(["update:modelValue"]);
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();

onMounted(() => {});

const toolbarConfig = {};
const editorConfig = {
  placeholder: "请输入内容...",
  scroll: true,
  minHeight: 300,
  maxHeight: 500,
};
const mode = "default";

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

// 编辑器创建完成时回调函数
const handleCreated = (editor) => {
  // 记录 editor 实例，重要！
  editorRef.value = editor;
  editor.enable();
  if (props.readonly) {
    editor.disable();
  }
};
//编辑器内容更改时的回调
const handleChange = (editor) => {
  // console.log("change:", editor.getHtml());
  try {
    const html = editor.getHtml();
    if (typeof html === "string") {
      emit("update:modelValue", html);
    }
  } catch (error) {
    console.error("编辑器内容更新失败:", error);
    customAlert("内容更新失败，请检查输入格式", "error");
  }
};

const handleDestroyed = (editor) => {
  // console.log("destroyed", editor);
};

const handleFocus = (editor) => {
  // console.log("focus", editor);
};

const handleBlur = (editor) => {
  // console.log("blur", editor);
};

const customAlert = (info, type) => {
  alert(`【自定义提示】${type} - ${info}`);
};

const customPaste = (editor, event, callback) => {
  // console.log("ClipboardEvent 粘贴事件对象", event);
  // 自定义插入内容
  editor.insertText("xxx");
  // 返回值（注意，vue 事件的返回值，不能用 return）
  callback(false); // 返回 false ，阻止默认粘贴行为
  // callback(true) // 返回 true ，继续默认的粘贴行为
};
// 监听readonly变化
watch(
  () => props.readonly,
  (newVal, oldVal) => {
    if (!editorRef.value) return;
    newVal ? editorRef.value.disable() : editorRef.value.enable();
  }
);
// const insertText = () => {
//   const editor = editorRef.value;
//   if (editor == null) return;
//   editor.insertText("hello world");
// };

// const printHtml = () => {
//   const editor = editorRef.value;
//   if (editor == null) return;
//   console.log(editor.getHtml());
// };

// const disable = () => {
//   const editor = editorRef.value;
//   if (editor == null) return;
//   editor.disable();
// };
</script>
