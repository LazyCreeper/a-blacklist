// 读取配置文件
import fs from 'fs-extra';
import { logger } from '../Utils/log';

const AppConfig = {
  http_port: 1236,
  database: {
    host: '',
    user: '',
    password: '',
    database: '',
  },
  oauth2_config: {
    client_id: '',
    client_secret: '',
    redirect_uri: '',
  },
};

export default (() => {
  if (fs.existsSync('config.json')) {
    return JSON.parse(
      fs.readFileSync('config.json', 'utf8'),
    ) as typeof AppConfig;
  } else {
    logger.warn('未检测到配置文件，正在尝试自动创建...');
    fs.writeFileSync('config.json', JSON.stringify(AppConfig, null, 2));
    return JSON.parse(
      fs.readFileSync('config.json', 'utf8'),
    ) as typeof AppConfig;
  }
})();
