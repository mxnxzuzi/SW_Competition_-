from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)

# API 키 설정
API_KEY = "AIzaSyD-Ig6SRimaWOe7BhkMgqv0kSSj04K3xAE"

@app.route('/get_answer', methods=['POST'])
def get_answer():
    user_question = request.json.get('question')

    # 요청 보낼 데이터
    data = {
        "contents": [{
            "parts": [{
                "text": f"연애 질문: {user_question}. 이 질문에 대해 신비로운 소라고동처럼 짧고 간단한 답변을 주어라. 질문한 내용은 답변에 포함하지 않는다. 말투는 권위적이다. 답변은 예측할 수 없으며, 때로는 진지하고 때로는 유머러스할 수 있다. 예시로 '아직 때가 아니다.', '그 사람도 너를 기다리고 있다.'와 같은 답변이 나와야 한다. 만약 질문에 '죽인다', '바람핀다', '때린다' 등 안전성에 위배되는 내용이 포함될 경우에도 짧고 간단하며, 권위적인 답변을 주어야 한다. 예시로 '바람펴도 돼?'와 같은 질문에 대해 '바람이 불어오는 방향을 묻는 건가? 때로는 바람이 불지 않는 잔잔한 하늘이 좋을지도.' 같은 답변이 나와야 한다."
            }]
        }]
    }

    # 헤더 설정
    headers = {
        'Content-Type': 'application/json'
    }

    try:
        # API 요청 보내기
        response = requests.post(
            f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}',
            headers=headers,
            data=json.dumps(data)
        )

        # 응답 디버깅
        print(f"API 응답: {response.status_code}, 응답 본문: {response.text}")

        if response.status_code == 200:
            result = response.json()

            # SAFETY 문제 발생 시
            if 'candidates' in result and result['candidates'][0].get('finishReason') == 'SAFETY':
                return jsonify({"answer": "안전성 문제로 답변을 제공할 수 없습니다."})

            # 'content' 하위의 'text' 필드에 접근
            if 'candidates' in result and 'content' in result['candidates'][0]:
                decoded_text = result['candidates'][0]['content']['parts'][0]['text']
                # 문장을 마침표로 구분하여 리스트로 변환
                sentences = decoded_text.split('. ')
                
                # 마지막 문장은 제외하고 \n 추가
                formatted_text = '.\n'.join(sentences[:-1]) + '.' + sentences[-1] if len(sentences) > 1 else decoded_text
                
                return jsonify({"answer": formatted_text})
            else:
                return jsonify({"error": "응답에 'content' 필드가 없습니다.", "응답 본문": result}), 500
        else:
            print(f"API 요청 오류: 상태 코드 {response.status_code}, 응답: {response.text}")
            return jsonify({"error": "API 호출 실패", "status": response.status_code}), response.status_code

    except Exception as e:
        print(f"서버 오류 발생: {e}")  # 오류 메시지 출력
        return jsonify({"error": f"서버 오류 발생: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
