import { WindowControls } from '#/components'
import React from 'react'
import WindowWrapper from '#/hoc/WindowWrapper'
import { blogPosts } from '#/constants'
import { ChevronLeft, ChevronRight, Copy, PanelLeft, Plus, Search, Share, ShieldHalf } from 'lucide-react';
import { useState, useEffect } from "react";
import gsap from "gsap";
import Blog from "#/pages/Blog";
import BlogPost from "#/pages/BlogPost";
import useWindowStore from "#/store/Window";

const Safari = () => {
    const { windows } = useWindowStore();
    const { isOpen } = windows.safari;
    const [browser, setBrowser] = useState({
        page: "blog",
        post: null,
        url: "jahnavisharma.dev/blog"
    });

    const goBack = () => {
        setBrowser({
            page: "blog",
            post: null,
            url: "jahnavisharma.dev/blog"
        });
    };

    const openPost = (post) => {
        setBrowser({
            page: "article",
            post,
            url: `jahnavisharma.dev/blog/${post.slug}`
        });
    };

    useEffect(() => {
        gsap.fromTo(
            ".browser-content",
            {x:50,opacity:0},
            {
                x:0,
                opacity:1,
                duration:.35,
                ease:"power3.out"
            }
        );
    }, [browser.page]);

    useEffect(() => {
        if (isOpen) {
            setBrowser({
                page: "blog",
                post: null,
                url: "jahnavisharma.dev/blog"
            });
        }
    }, [isOpen]);

  return (
    <>
    <div id="window-header">
        <WindowControls target="safari"/>

        <PanelLeft className="ml-10 icon"/>

        <div className="flex items-center gap-1 ml-5">
            <button onClick={goBack} disabled={browser.page==="blog"}
                className={browser.page==="blog" ? "opacity-40 cursor-not-allowed" : ""}
            >
                <ChevronLeft className="icon"/>
            </button>
            <button disabled>
                <ChevronRight className="icon"/>
            </button>
        </div>

        <div className="flex-1 flex-center gap-3">
            <ShieldHalf className="icon"/>
            <div className="search">
                <Search className="icon"/>
                <input 
                    type="text" 
                    value={`${browser.url}`}
                    readOnly
                    className="flex-1 text-center"
                />
            </div>
        </div>

        <div className="flex items-center gap-5">
            <Share className="icon"/>
            <Plus className="icon"/>
            <Copy className="icon"/>
        </div>
    </div>

    {/* <div className="blog">
        <h2>My Developer Blog</h2>
        <div className='space-y-8'>
            {blogPosts.map(({id, image, title, date, link}) => (
                <div key={id} className='blog-post'>
                    <div className='col-span-2'>
                        <img src={image} alt={title}/>
                    </div>
                    <div className='content'>
                        <p>{date}</p>
                        <h3>{title}</h3>
                        <a href={link} target="_blank" rel="noopener noreferrer">
                            Read More <MoveRight className="icon-hover"/>
                        </a>
                    </div>
                </div>
            ))}
        </div>
    </div> */}
    <div className="browser-content">
        {browser.page==="blog" ? (
            <Blog
                posts={blogPosts}
                onReadMore={openPost}
            />
        ) : (
            <BlogPost
                post={browser.post}
                onBack={goBack}
            />
        )}
    </div>
    </>
  )
};

const SafariWindow = WindowWrapper(Safari, 'safari');

export default SafariWindow;
