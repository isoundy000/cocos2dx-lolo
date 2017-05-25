/****************************************************************************
 
 ****************************************************************************/


#include "Updater.h"
#include "MD5.h"
#include "cocos2d.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"
#include "external/unzip/unzip.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#include "curl/include/win32/curl/curl.h"
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#include "curl/include/android/curl/curl.h"
#elif(CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
#include "curl/include/ios/curl/curl.h"
#endif

#include <sstream>


USING_NS_CC;


namespace lolo
{
	std::string Updater::_url;
	std::string Updater::_md5;
	std::string Updater::_version;

	State Updater::_state = State::NOT_STARTED;

	long Updater::_byteLoadedBefore = 0;
	double Updater::_byteLoaded = 0;
	double Updater::_byteTotal = 0;
	double Updater::_speed = 0;

	FILE *Updater::_file = nullptr;

	/* ��ʱʹ�õ� curl ָ�� */
	CURL *__curl = nullptr;

	Updater::Updater()
	{
	}

	Updater::~Updater()
	{
	}


	void Updater::start(std::string url, std::string version, std::string md5)
	{
		_url = url;
		_md5 = md5;
		_version = version;

		// �������̵߳���
		curl_global_init(CURL_GLOBAL_ALL);

		// ���������߳�
		std::thread thr(download);
		thr.detach();
	}


	void Updater::download()
	{
		_state = State::DOWNLOAD;


		// �������ļ����ƺ�·�������� patch �ļ���
		std::string patchPath = CCFileUtils::getInstance()->getWritablePath() + "patch/";
		std::string zipFilePath = patchPath + _md5;
		FileUtils::getInstance()->createDirectory(patchPath);
		CCLOG("[lolo::Updater] update url : %s", _url.c_str());
		CCLOG("[lolo::Updater] zip path : %s", zipFilePath.c_str());

		_byteLoadedBefore = 0;// �ļ��������ֽ���

		// �ļ��Ѵ���
		std::string md5;
		if (CCFileUtils::getInstance()->isFileExist(zipFilePath))
		{
			// ��֤MD5�����ļ��Ƿ��Ѿ����������
			md5 = MD5::getFileMD5(zipFilePath);
			if (md5 == _md5) {
				unpatch();
				return;
			}

			_file = fopen(zipFilePath.c_str(), "ab+");
			fseek(_file, 0, SEEK_END);
			_byteLoadedBefore = ftell(_file);
			CCLOG("[lolo::Updater] before loaded byte : %d", (int)_byteLoadedBefore);
		}
		// ������
		else {
			_file = fopen(zipFilePath.c_str(), "wb");
		}

		if (_file == nullptr) {
			CCLOG("[lolo::Updater] [ERROR] can not open zip file");
			_state = State::FAIL_DOWNLOAD;
			return;
		}


		// ���� easy curl
		CURL *curl = curl_easy_init();
		if (curl == nullptr) {
			_state = State::FAIL_DOWNLOAD;
			CCLOG("[lolo::Updater] [ERROR] can not init curl");
			return;
		}
		__curl = curl;

		// request headers
		curl_slist *headers = nullptr;

		std::stringstream sout;
		sout << _byteLoadedBefore;

		std::string header_range = "Range: bytes=" + sout.str() + "-";// �ϵ�����
		headers = curl_slist_append(headers, header_range.c_str());
		headers = curl_slist_append(headers, "Charset: UTF-8");
		curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
		
		// POST����
		std::string postData = "action=getPatch&version=" + _version;
		curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, postData.size());
		curl_easy_setopt(curl, CURLOPT_POSTFIELDS, postData.c_str());

		curl_easy_setopt(curl, CURLOPT_URL, _url.c_str());
		curl_easy_setopt(curl, CURLOPT_FAILONERROR, 1L);// ��HTTP����ֵ���ڵ���400��ʱ������ʧ��

		
		curl_easy_setopt(curl, CURLOPT_NOPROGRESS, 0L);
		//curl_easy_setopt(curl, CURLOPT_PROGRESSDATA, curl);
		curl_easy_setopt(curl, CURLOPT_PROGRESSFUNCTION, progressHandler);

		curl_easy_setopt(curl, CURLOPT_WRITEDATA, _file);
		curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, writeHandler);

		//curl_easy_setopt(curl, CURLOPT_RESUME_FROM, _byteLoadedBefore);// �ϵ�����

		CURLcode code = curl_easy_perform(curl);
		CCLOG("[lolo::Updater] download zip code : %d", code);

		curl_easy_cleanup(curl);
		fclose(_file);
		__curl = nullptr;
		_file = nullptr;


		double byteLoaded = getByteLoaded();
		if (byteLoaded < _byteTotal) {
			// �ļ���û���꣬���ùܣ����´μ�������
			_state = State::FAIL_DOWNLOAD;
		}
		else {
			if (byteLoaded == _byteTotal) {
				// ��֤MD5�����ļ��Ƿ�һ��
				md5 = MD5::getFileMD5(zipFilePath);
				if (md5 == _md5) {
					unpatch();
				}
				else {
					_state = State::FAIL_MD5;
				}
			}
			else {
				_state = State::FAIL_DOWNLOAD;
			}
			FileUtils::getInstance()->removeFile(zipFilePath);// ɾ��zip
			CCLOG("[lolo::Updater] removed zip");
		}
	}


	void Updater::unpatch()
	{
		_state = State::UNZIP;

		// ��ѹ���°��� assets Ŀ¼
		std::string assetsPath = FileUtils::getInstance()->getWritablePath() + "assets/";
		FileUtils::getInstance()->createDirectory(assetsPath);
		std::string zipFilePath = CCFileUtils::getInstance()->getWritablePath() + "patch/" + _md5;

		if (unzip(zipFilePath, assetsPath)) {
			// ��� writablePath/assets/Updater.jsc �Ļ���
			std::string updaterJSC = assetsPath + "Updater.jsc";
			ScriptingCore::getInstance()->cleanScript(updaterJSC.c_str());
			_state = State::COMPLETE;
		}
		else {
			_state = State::FAIL_UNZIP;
		}
	}


	void Updater::progressHandler(void *clientp, double dltotal, double dlnow, double ultotal, double ulnow)
	{
		double speed;// �����ٶ� �ֽ�/��
		curl_easy_getinfo(__curl, CURLINFO_SPEED_DOWNLOAD, &speed);

		_byteLoaded = dlnow;
		_byteTotal = dltotal;
		_speed = speed;

		//CCLOG("[lolo::Updater] download speed : %d kb/s", (int)(speed / 1024));
	}


	size_t Updater::writeHandler(void *ptr, size_t size, size_t nmemb, FILE *stream)
	{
		size_t written = fwrite(ptr, size, nmemb, stream);
		return written;
	}



	bool Updater::unzip(std::string filename, std::string destPath)
	{
		// Open the zip file
		std::string outFileName = filename;
		unzFile zipfile = unzOpen(outFileName.c_str());
		if (!zipfile)
		{
			CCLOG("[lolo::Updater] [ERROR] can not open downloaded zip file %s", outFileName.c_str());
			return false;
		}

		// Get info about the zip file
		unz_global_info global_info;
		if (unzGetGlobalInfo(zipfile, &global_info) != UNZ_OK)
		{
			CCLOG("[lolo::Updater] [ERROR] can not read file global info of %s", outFileName.c_str());
			unzClose(zipfile);
			return false;
		}

		const int BUFFER_SIZE = 8192;
		const int MAX_FILENAME = 512;
		// Buffer to hold data read from the zip file
		char readBuffer[BUFFER_SIZE];

		CCLOG("[lolo::Updater] start uncompressing");

		// Loop to extract all files.
		uLong i;
		for (i = 0; i < global_info.number_entry; ++i)
		{
			// Get info about current file.
			unz_file_info fileInfo;
			char fileName[MAX_FILENAME];
			if (unzGetCurrentFileInfo(zipfile,
				&fileInfo,
				fileName,
				MAX_FILENAME,
				NULL,
				0,
				NULL,
				0) != UNZ_OK)
			{
				CCLOG("[lolo::Updater] [ERROR] can not read file info");
				unzClose(zipfile);
				return false;
			}

			std::string storagePath = destPath;
			std::string fullPath = storagePath + fileName;

			// Check if this entry is a directory or a file.
			const size_t filenameLength = strlen(fileName);
			if (fileName[filenameLength - 1] == '/')
			{
				// get all dir
				std::string fileNameStr = std::string(fileName);
				size_t position = 0;
				while ((position = fileNameStr.find_first_of("/", position)) != std::string::npos)
				{
					std::string dirPath = storagePath + fileNameStr.substr(0, position);
					// Entry is a direcotry, so create it.
					// If the directory exists, it will failed scilently.
					if (!FileUtils::getInstance()->createDirectory(dirPath.c_str()))
					{
						CCLOG("can not create directory %s", dirPath.c_str());
						unzClose(zipfile);
						return false;
					}
					position++;
				}
			}
			else
			{
				// Entry is a file, so extract it.

				// Open current file.
				if (unzOpenCurrentFile(zipfile) != UNZ_OK)
				{
					CCLOG("[lolo::Updater] [ERROR] can not open file %s", fileName);
					unzClose(zipfile);
					return false;
				}

				// Create a file to store current file.
				FILE *out = fopen(fullPath.c_str(), "wb");
				if (!out)
				{
					CCLOG("[lolo::Updater] [ERROR] can not open destination file %s", fullPath.c_str());
					unzCloseCurrentFile(zipfile);
					unzClose(zipfile);
					return false;
				}

				// Write current file content to destinate file.
				int error = UNZ_OK;
				do
				{
					error = unzReadCurrentFile(zipfile, readBuffer, BUFFER_SIZE);
					if (error < 0)
					{
						CCLOG("[lolo::Updater] [ERROR] can not read zip file %s, error code is %d", fileName, error);
						unzCloseCurrentFile(zipfile);
						unzClose(zipfile);
						return false;
					}

					if (error > 0)
					{
						fwrite(readBuffer, error, 1, out);
					}
				} while (error > 0);

				fclose(out);
			}

			unzCloseCurrentFile(zipfile);

			// Goto next entry listed in the zip file.
			if ((i + 1) < global_info.number_entry)
			{
				if (unzGoToNextFile(zipfile) != UNZ_OK)
				{
					CCLOG("[lolo::Updater] [ERROR] can not read next file");
					unzClose(zipfile);
					return false;
				}
			}
		}
		unzClose(zipfile);
		CCLOG("[lolo::Updater] end uncompressing");

		return true;
	}



	State Updater::getState()
	{
		return _state;
	}

	double Updater::getByteLoaded()
	{
		return _byteLoadedBefore + _byteLoaded;
	}

	double Updater::getByteTotal()
	{
		return _byteTotal;
	}

	long Updater::getSpeed()
	{
		return _speed;
	}



	void Updater::enableAssetsDir()
	{
		FileUtils::getInstance()->addSearchPath(FileUtils::getInstance()->getWritablePath() + "assets", true);
	}


	void Updater::clearUpdateDirectory()
	{
		std::string writablePath = FileUtils::getInstance()->getWritablePath();
		FileUtils::getInstance()->removeDirectory(writablePath + "assets/");
		FileUtils::getInstance()->removeDirectory(writablePath + "patch/");
	}


	void Updater::resetApp()
	{
		ScriptingCore::getInstance()->reset();
	}


	//
}