#ifndef __LOLO_STATS_H__
#define __LOLO_STATS_H__


#include <chrono>
#include <string>
#include "network/WebSocket.h"


/*�Ƿ�����֡��ʱͳ��*/
#define LOLO_STATS_ENABLED 1


namespace lolo
{

	class WebSocketDelegate : public cocos2d::network::WebSocket::Delegate
	{

	public:
		WebSocketDelegate();
		~WebSocketDelegate();

		void send(std::string &msg);

	private:
		cocos2d::network::WebSocket* _ws;

		virtual void onOpen(cocos2d::network::WebSocket* ws);
		virtual void onMessage(cocos2d::network::WebSocket* ws, const cocos2d::network::WebSocket::Data& data);
		virtual void onClose(cocos2d::network::WebSocket* ws);
		virtual void onError(cocos2d::network::WebSocket* ws, const cocos2d::network::WebSocket::ErrorCode& error);

	};





	/*���� startCodeTime() ʱ�����ص�ID����*/
	typedef unsigned int STATS_ID;


	/**
	 * ͳ��ÿ֡ʱ��ķѣ������ʱ����Ⱦ��ʱ������ʱ����
	 * �Լ�ÿ����֡ͳ��һ��CPUʹ����
	 * ���õ���ʱ�䵥λ��Ϊ΢��
	 */
	class Stats
	{


	public:

		Stats();
		virtual ~Stats();


		/**
		 * �����µ�һ֡������ͳ����һ֡��
		 */
		static void enterFrame();



		/**
		 * ��ʼͳ����Ⱦ��ʱ
		 */
		static void startRenderTime();

		/**
		 * ����ͳ����Ⱦ��ʱ
		 */
		static void endRenderTime();

		/**
		 * ��ͳ����Ⱦ��ʱ�Ĺ����У���ȥ�����ʱ
		 */
		static void lessRenderTime(std::chrono::microseconds time);



		/**
		 * ��ʼͳ�ƴ����ʱ
		 * @return ���ظ���ͳ��ID
		 */
		static STATS_ID startCodeTime();

		/**
		 * ����ͳ�ƴ����ʱ
		 * @param id ͳ��ID
		 * @return �ӿ�ʼͳ�Ƶ�����ͳ����������ʱ��
		 */
		static std::chrono::microseconds endCodeTime(STATS_ID id);



	private:

		/*������ͳ��ID*/
		static STATS_ID _id;
		/*��ǰ����ͳ�ƴ����ʱ��ID*/
		static STATS_ID _codeTimeID;

		/*֡��ʼ��ʱ���*/
		static std::chrono::steady_clock::time_point _tpFrame;
		/*��ʼͳ����Ⱦ��ʱ��ʱ���*/
		static std::chrono::steady_clock::time_point _tpRender;
		/*��ʼͳ�ƴ����ʱ��ʱ���*/
		static std::chrono::steady_clock::time_point _tpCode;

		/*��Ⱦ�Ѻ�ʱ*/
		static std::chrono::microseconds _tRender;
		/*�����Ѻ�ʱ*/
		static std::chrono::microseconds _tCode;
		/*��Ҫ��ȥ����Ⱦ��ʱ*/
		static std::chrono::microseconds _tRenderLessTime;


		static WebSocketDelegate* _wsd;
	};

}


#endif // __LOLO_STATS_H__