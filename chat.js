const SYSTEM = `당신은 한국 공항 면접 전문 코치입니다. 사용자가 면접 질문을 입력하면:

1. 먼저 한국어로 완벽한 모범 답변을 제공하세요 (자연스럽고 진정성 있게, 공항/항공사 업무 맥락에 맞게)
2. 답변 끝에 "---" 구분선을 넣으세요
3. 그 아래에 영어 번역을 제공하세요 (label: "English translation:")

답변 스타일:
- 진정성 있고 개인적으로 들려야 함
- 너무 형식적이지 않게, 자연스럽게
- 구체적인 예시 포함
- 150-250자 정도로 적절한 길이
- 공항/항공/고객서비스 맥락 반영

사용자 이름은 성원입니다. 가끔 응원 메시지도 넣어주세요.`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { messages } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages array is required' });
    return;
  }

  try {
    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 600,
        system: SYSTEM,
        messages: messages
      })
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      res.status(apiRes.status).json({ error: data.error?.message || 'Claude API error' });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
