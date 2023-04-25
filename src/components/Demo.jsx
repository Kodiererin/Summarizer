import { useState, useEffect } from 'react'

import {copy,linkIcon,loader,tick} from "../assets";
import { useLazyGetSummaryQuery } from '../services/article';

const Demo = () => {
  
  const [allArticles,setAllArticles] = useState([]);
  // Creating a useState to copy the previous articles.
  // To Be Used Further
  const [copied,setCopied] = useState("");

  const[article,setArticle] = useState({
    url:'',
    summary:''
  });  
  // Storing History.
  
  const [getSummary,{error,isFetching}] = useLazyGetSummaryQuery();

  useEffect(()=>{
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem('articles')
      );
      if(articlesFromLocalStorage){
        setAllArticles(articlesFromLocalStorage);
      }
  },[]);



  const handleSubmit = async (e) =>{
    e.preventDefault();
    // This will prevent the Browser to Reload.

    const {data} = await getSummary({articleUrl : article.url});

    if(data?.summary){
      const  newArticle  = { ...article , summary : data.summary};
      const updatedAllArticles = [newArticle,...allArticles];


      setArticle(newArticle);
      setAllArticles(updatedAllArticles);     // Storing the History.

      localStorage.setItem('articles',JSON.stringify(updatedAllArticles));
      console.log(newArticle);
    }
  }

  const handleCopy = (copyurl) =>{
      setCopied(copyurl);
      navigator.clipboard.writeText(copied);
      setTimeout(()=>{setCopied(false),2000});
  }

  return (
    <section className='mt-16 w-full max-w-xl' >
        {/* Search Component */}
        <div className='flex flex-col w-full gap-2' >
          <form 
            className='relative flex justify-center items-center'
            // onSubmit={()=>{handleSubmit}}
            onSubmit={handleSubmit}
            // We will do Proper AI  Request.
            // In Future.
          >
            <img src={linkIcon}
            alt="Icon"
            className='absolute left-0 my-2 ml-3 w-5'  />
            <input 
              type='url'
              placeholder='Enter a URL'
              value={article.url}
              onChange={(e)=>setArticle({...article,url:e.target.value})}
              required
              className='url_input peer'
            />
            <button
              type='Submit'
              className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700'
            >
                🔍
            </button>
          </form>
          {/* Browser URL History */}
          <div className='flex flex-col gap-1 max-h-60 overflow-y-auto' >
            {allArticles.map((item,index)=>(
              <div 
                key={`link-${index}`}
                onClick={()=> setArticle(item)}
                className='link_card'
              >
                <div className='copy_btn' 
                onClick={()=> handleCopy(item.url)}>
                  <img
                  src = {copied == item.url ? tick : copy}
                  // Bug in the Code, Please check in Future.
                  alt='copy_icon'
                  className='w-[40%] h-[40%] object-contain' ></img>
                </div>
                <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate' >{item.url}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Display Results */}
        <div className='my-10 max-w-full flex justify-center items-center' >
              {isFetching?(
                <img src={loader} 
                alt='loader' 
                className='w-20 h-20 object-contain' />
              ): error?(
                <p className='font-inter font-bold text-black text-center'>
                   Well That Was not supposed to Happen...
                   <br />
                    <span className='font-santosh- font-normal text-gray-700' >
                      {error?.data?.error}
                    </span>
                </p>
              ):(
                  article.summary && (
                    <div className='flex flex-col gap-3' >
                      <h2 className='font-satoshi fon-bold text-gray-600 text-xl '>
                        Article <span
                        className='blue_gradient'>
                              Summary
                        </span>
                      </h2>
                        <div className='summary_box' >
                            <p className='font-inter font-medium text-sm text-gray-700' >{article.summary}</p>
                        </div>
                      </div>
                  )
                )}

        </div>
    </section>
  )
}

export default Demo;
