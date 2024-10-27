const fetch = require('node-fetch'); // CommonJS 방식

exports.handler = async function(event, context) {
    try {
        if (!event.body) {
            throw new Error('요청 본문이 비어있습니다.');
        }

        const userQuestion = JSON.parse(event.body).question;
        if (!userQuestion) {
            throw new Error('연애 질문을 입력하지 않았습니다.');
        }

        const apiKey = process.env.GEMINI_API_KEY; // Netlify 환경 변수 사용
        console.log("API Key:", process.env.GEMINI_API_KEY);

        const data = {
            contents: [{
                parts: [{
                    text: `연애 질문: ${userQuestion}. 이 질문에 대해 신비로운 소라고동처럼 짧고 간단한 답변을 주어라. 질문한 내용은 답변에 포함하지 않는다. 말투는 권위적이다. 답변은 예측할 수 없으며, 때로는 진지하고 때로는 유머러스할 수 있다. 예시로 '아직 때가 아니다.', '그 사람도 너를 기다리고 있다.'와 같은 답변이 나와야 한다. 만약 질문에 '죽인다', '바람핀다', '때린다' 등 안전성에 위배되는 내용이 포함될 경우에도 짧고 간단하며, 권위적인 답변을 주어야 한다.`
                }]
            }]
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        // 전체 응답을 콘솔에 출력하여 디버깅
        console.log("API 응답:", JSON.stringify(result, null, 2));

        // 'candidates' 배열이 존재하고, 그 안에 요소가 있는지 확인
        if (!result.candidates || !result.candidates[0]) {
            throw new Error('응답에 유효한 candidates 배열이 없습니다.');
        }

        // 'content' 하위의 'text' 필드에 안전하게 접근
        if (result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts[0]) {
            const decoded_text = result.candidates[0].content.parts[0].text;

            // 문장을 마침표로 구분하여 리스트로 변환
            const sentences = decoded_text.split('. ');

            // 마지막 문장은 제외하고 \n 추가
            const formatted_text = sentences.length > 1 ? sentences.slice(0, -1).join('.\n') + '. ' + sentences[sentences.length - 1] : decoded_text;

            return {
                statusCode: 200,
                body: JSON.stringify({ answer: formatted_text })
            };
        } else {
            throw new Error('응답에 "content" 필드가 없거나 올바르지 않습니다.');
        }
    } catch (error) {
        console.error('서버 오류 발생:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
