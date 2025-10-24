async function recognize(base64, lang, options) {
    const { config, utils } = options;
    const { tauriFetch } = utils;
    let { apikey, model, customPrompt } = config;

    // 检查API Key
    if (!apikey || apikey.length === 0) {
        throw "请配置硅基流动 API Key";
    }

    // 设置默认模型
    if (!model || model.length === 0) {
        model = "Qwen/Qwen3-VL-235B-A22B-Instruct";
    }

    // 语言映射 - 将pot语言代码转换为更友好的描述
    const langMap = {
        "auto": "自动检测",
        "zh_cn": "简体中文",
        "zh_tw": "繁体中文",
        "en": "英语",
        "ja": "日语",
        "ko": "韩语",
        "fr": "法语",
        "es": "西班牙语",
        "ru": "俄语",
        "de": "德语",
        "it": "意大利语",
        "tr": "土耳其语",
        "pt": "葡萄牙语",
        "vi": "越南语",
        "th": "泰语",
        "ar": "阿拉伯语",
        "hi": "印地语",
        "fa": "波斯语"
    };

    // 构建提示词
    const defaultPrompt = `请精确识别图片中的所有内容，直接输出识别结果，不要添加任何解释、说明或额外的文字。

## 核心要求

1. **保持原样**：严格保持原文的排版、段落、换行、缩进和空格
2. **按顺序识别**：按照从上到下、从左到右的阅读顺序输出内容
3. **完整识别**：不要遗漏任何文字、符号或标点

## 数学公式处理

1. 所有数学公式和数学符号必须使用标准 LaTeX 格式
2. 行内公式用单个 \`$\` 包裹，如：\`$x^2 + y^2 = z^2$\`
3. 独立公式块用两个 \`$$\` 包裹，如：\`$$\\\\sum_{i=1}^n i^2 = \\\\frac{n(n+1)(2n+1)}{6}$$\`
4. 普通数字和运算符（如价格、日期、编号）不要使用 LaTeX 格式
5. 确保所有数学符号（∑、∫、≠、≈、±、×、÷、√ 等）都被正确转换为 LaTeX 并包裹

## Markdown 格式保留

1. 标题：保留 \`#\` 标记（\`#\` \`##\` \`###\` 等）
2. 列表：保留有序列表（\`1.\` \`2.\`）和无序列表（\`-\` \`*\`）的标记
3. 勾选框：保留 \`- [ ]\` 和 \`- [x]\` 格式
4. 引用块：保留 \`>\` 标记及嵌套引用 \`>>\`
5. 代码块：使用 \`\`\` 包裹代码块，并标注语言类型（如 \`\`\`python）
6. 行内代码：使用单个 \`\` 包裹
7. 粗体/斜体：保留 \`**粗体**\` 和 \`*斜体*\` 标记
8. 链接：保留 \`[文字](url)\` 格式
9. 表格：使用标准 Markdown 表格语法

## 表格识别

1. 使用 Markdown 表格格式：
\`\`\`
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 内容1 | 内容2 | 内容3 |
\`\`\`
2. 保持单元格对齐方式（左对齐、居中、右对齐）
3. 正确识别合并单元格的内容
4. 如果表格过于复杂，保持结构清晰优先

## 特殊场景处理

**验证码图片**（通常只有 4-6 位字符）：
- 只输出验证码字符本身，不加任何说明
- 忽略背景干扰线、噪点和变形
- 仔细区分易混淆字符：
  * 数字 0 和字母 O
  * 数字 1 和字母 l、I
  * 数字 2 和字母 Z
  * 数字 5 和字母 S
  * 数字 6 和字母 G
  * 数字 8 和字母 B
  * 数字 9 和字母 g、q
  * 数字 7 和字母 T
  * 数字 4 和字母 A

**多列文本**：
- 先识别左列内容，再识别右列内容
- 用空行分隔不同列

**手写文字**：
- 尽可能识别潦草或不清晰的手写文字
- 如果某个字无法确定，用 [?] 标记

**其他语言文字**：
- 保持原语言输出，不要翻译
- 正确识别特殊字符和重音符号

## 注意事项

- 不要添加"图片中的内容是..."、"识别结果如下..."等开头语
- 不要添加"以上是识别结果"等结尾语
- 遇到不清晰的内容，尽可能根据上下文推断
- 保持标点符号的准确性（中英文标点要区分）`;

    let prompt = customPrompt || defaultPrompt;
    
    // 如果指定了语言且不是自动检测，添加语言提示（仅在使用默认提示词时）
    if (!customPrompt && lang && lang !== "auto" && langMap[lang]) {
        prompt += `\n\n图片中的文字主要是${langMap[lang]}。`;
    }

    // 准备请求数据
    const imageUrl = `data:image/png;base64,${base64}`;
    
    const requestBody = {
        model: model,
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: prompt
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: imageUrl
                        }
                    }
                ]
            }
        ],
        stream: false,
        max_tokens: 2048,
        temperature: 0.1,
        top_p: 0.7
    };

    try {
        // 调用硅基流动API
        let res = await tauriFetch('https://api.siliconflow.cn/v1/chat/completions', {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apikey}`,
                "Content-Type": "application/json"
            },
            body: {
                type: "Json",
                payload: requestBody
            }
        });

        if (res.ok) {
            const result = res.data;
            
            // 检查响应格式
            if (result.choices && result.choices.length > 0) {
                const content = result.choices[0].message.content;
                
                if (content && content.length > 0) {
                    // 返回识别的文字内容
                    return content.trim();
                } else {
                    throw "未能识别到文字内容";
                }
            } else {
                throw "API返回格式错误: " + JSON.stringify(result);
            }
        } else {
            // 处理错误响应
            const errorMsg = res.data?.error?.message || res.data?.message || JSON.stringify(res.data);
            throw `API请求失败 (${res.status}): ${errorMsg}`;
        }
    } catch (error) {
        // 捕获网络错误或其他异常
        if (typeof error === 'string') {
            throw error;
        } else {
            throw `识别失败: ${error.message || JSON.stringify(error)}`;
        }
    }
}