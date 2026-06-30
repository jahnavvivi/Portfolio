import React from 'react'
import WindowWrapper from '#/hoc/WindowWrapper'
import { WindowControls } from '#/components'
import useWindowStore from '#/store/Window'

const Image = () => {
  const { windows } = useWindowStore();
  const fileData = windows.imgfile?.data;

  if(!fileData)
    return null;

  const { name, imageUrl, image, icon } = fileData;
  const previewImage = imageUrl || image || icon;

  if(!previewImage)
    return null;

  return (
    <>
      <div id="window-header">
        <WindowControls target="imgfile" />
        <h2>{name}</h2>
      </div>

      <div className="preview">
        <img src={previewImage} alt={name} />
      </div>
    </>
  )
}

const ImageWindow = WindowWrapper(Image, 'imgfile');

export default ImageWindow