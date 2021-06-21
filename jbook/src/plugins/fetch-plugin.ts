import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage' ;

const fileCache = localForage.createInstance({
  name: 'filecache'
});

export const fetchPlugin = (inputCode: string) =>{
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild){
    build.onLoad({filter: /(^index\.js$)/},()=>{
      return {
        loader: 'jsx',
        contents: inputCode,
      };
    });

  build.onLoad({filter: /.*/}, async (args:any)=>{
        /**
     * @async cachedResult - Checks to see if file is currently inside the 
     * cache. If not within indexDB we store the result otherwise return it.
     * Documentation found @link{https://www.npmjs.com/package/localforage}
     */
         const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);

         if(cachedResult){  return cachedResult;}
  });

    build.onLoad({filter: /.css$/}, async(args:any) =>{
   

    const { data, request } = await axios.get(args.path);

    const escaped = data
    .replace(/\n/g,'') // New lines escaped
    .replace(/"/g,'\\"') // Double quotes escpaed
    .replace(/'/g,"\\'"); // Single quotes escaped
    const contents =  
    `
    const style = document.createElement('style');
    style.innerText = '${escaped}';
    document.head.appendChild(style);
    `;

    const result: esbuild.OnLoadResult = 
    {
      loader: 'jsx',
      contents,
      resolveDir: new URL('./',request.responseURL).pathname
    };
    await fileCache.setItem(args.path,result);
    return result
    });
      build.onLoad({ filter: /.*/ }, async (args: any) => {

    const { data, request } = await axios.get(args.path);

    const result: esbuild.OnLoadResult = 
    {
      loader: 'jsx',
      contents:data ,
      resolveDir: new URL('./',request.responseURL).pathname
    };
    await fileCache.setItem(args.path,result);
    return result
  });
  }
  }
}