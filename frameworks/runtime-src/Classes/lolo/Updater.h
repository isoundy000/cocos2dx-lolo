#ifndef __LOLO_UPDATER_H__
#define __LOLO_UPDATER_H__


#include <string>


namespace lolo
{


	/**
	 * ����״̬
	 */
	enum class State
	{
		NOT_STARTED,    /* δ��ʼ */
		COMPLETE,       /* ������� */
		DOWNLOAD,       /* ��������zip�� */
		UNZIP,          /* ���ڽ�ѹzip�� */
		FAIL_DOWNLOAD,  /* ����ʧ�� - ����ʧ�� */
		FAIL_MD5,       /* ����ʧ�� - MD5��һ�� */
		FAIL_UNZIP,     /* ����ʧ�� - ��ѹ������ */
	};


	/**
	 * �ȸ������
	 */
	class Updater
	{


	public:

		Updater();
		virtual ~Updater();



		/**
		 * �� writablePath/assets Ŀ¼����Ϊ��������·��
		 */
		static void enableAssetsDir();

		/**
		 * ��ʼ����
		 */
		static void start(std::string url, std::string version, std::string md5);

		/**
		* ��� patch �� assets �ļ���
		*/
		static void clearUpdateDirectory();

		/**
		 * ���ã�������APP
		 */
		static void resetApp();


		/**
		 * ��ȡ��ǰ״̬
		 */
		static State getState();

		/**
		 * ��ȡ�������ֽ�
		 */
		static double getByteLoaded();

		/**
		 * ��ȡ���ֽ�
		 */
		static double getByteTotal();

		/**
		 * ��ȡ�����ٶȣ�byte/s��
		 */
		static long getSpeed();


	private:

		/*ѹ������ַ*/
		static std::string _url;
		/*ѹ����MD5��*/
		static std::string _md5;
		/*��ǰ�汾��*/
		static std::string _version;

		/*��ǰ����״̬*/
		static State _state;

		/*�ϵ�����ǰ���������ֽ�*/
		static long _byteLoadedBefore;
		/*�������ֽ�*/
		static double _byteLoaded;
		/*���ֽ�*/
		static double _byteTotal;
		/*�����ٶȣ��ֽ�/ÿ�룩*/
		static double _speed;

		/*ѹ�����ļ�ָ��*/
		static FILE *_file;



		/**
		 * �̺߳��������ظ��°�
		 */
		static void download();

		/*
		 * ���ؽ��ȸ���
		 */
		static void progressHandler(void *clientp, double dltotal, double dlnow, double ultotal, double ulnow);

		/**
		 * д���ļ�
		 */
		static size_t writeHandler(void *ptr, size_t size, size_t nmemb, FILE *stream);

		/**
		 * ��ѹ�����غõĲ�����
		 */
		static void unpatch();

		/**
		 * ��ѹzip�ļ�
		 */
		static bool unzip(std::string filename, std::string destPath);
	};


}


#endif // __LOLO_UPDATER_H__