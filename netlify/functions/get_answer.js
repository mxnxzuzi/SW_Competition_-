const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const apiKey = process.env.GEMINI_API_KEY; // Netlify 환경 변수 사용
    const userQuestion = JSON.parse(event.body).question;

    const data = {
        contents: [{
            parts: [{
                text: `연애 질문: ${userQuestion}. 이 질문에 대해 신비로운 소라고동처럼 짧고 간단한 답변을 주어라. 질문한 내용은 답변에 포함하지 않는다. 말투는 권위적이다. 답변은 예측할 수 없으며, 때로는 진지하고 때로는 유머러스할 수 있다. 예시로 '아직 때가 아니다.', '그 사람도 너를 기다리고 있다.'와 같은 답변이 나와야 한다. 만약 질문에 '죽인다', '바람핀다', '때린다' 등 안전성에 위배되는 내용이 포함될 경우에도 짧고 간단하며, 권위적인 답변을 주어야 한다. 예시로 '바람펴도 돼?'와 같은 질문에 대해 '바람이 불어오는 방향을 묻는 건가? 때로는 바람이 불지 않는 잔잔한 하늘이 좋을지도.' 같은 답변이 나와야 한다.`
            }]
        }]
    };

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify({ answer: result.candidates[0].content.parts[0].text })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'API 호출 중 오류가 발생했습니다.' })
        };
    }
};
