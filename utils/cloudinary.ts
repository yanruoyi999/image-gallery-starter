import { v2 as cloudinary } from 'cloudinary';

// 直接导入v2版本，这是推荐的做法
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// 添加图片获取函数
export async function getImages() {
  console.log('正在获取Cloudinary图片，配置信息:', {
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    folder: process.env.CLOUDINARY_FOLDER,
  });

  try {
    const results = await cloudinary.api.resources({
      type: 'upload',
      prefix: process.env.CLOUDINARY_FOLDER,
      max_results: 100,
    });

    console.log(`成功从Cloudinary获取了${results.resources.length}张图片`);
    
    return results.resources.map((resource) => ({
      id: resource.public_id,
      height: resource.height,
      width: resource.width,
      public_id: resource.public_id,
      format: resource.format,
      // 使用高质量参数
      src: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/q_auto:best,f_auto/${resource.public_id}`,
      // 为模糊效果提供一个小尺寸的图片
      blurDataUrl: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_10,e_blur:1000/${resource.public_id}`,
    }));
  } catch (error) {
    console.error('获取Cloudinary图片时出错:', error);
    return [];
  }
}

// 获取单张图片的详细信息
export async function getImage(public_id) {
  try {
    const result = await cloudinary.api.resource(public_id);
    
    return {
      id: result.public_id,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
      src: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/q_auto:best,f_auto/${result.public_id}`,
      blurDataUrl: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_10,e_blur:1000/${result.public_id}`,
    };
  } catch (error) {
    console.error('获取单张图片详情时出错:', error);
    return null;
  }
}

// 导出配置好的cloudinary实例
export default cloudinary;
