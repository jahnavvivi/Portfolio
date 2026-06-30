import React from 'react'
import WindowWrapper from '#/hoc/WindowWrapper'
import { WindowControls } from '#/components'
import useWindowStore from '#/store/Window'

const Text = () => {
  const { windows } = useWindowStore();
  const fileData = windows.txtfile?.data;

  if(!fileData)
    return null;

  const { name, image, icon, subtitle, description = [] } = fileData;
  const previewImage = image || null;

  return (
    <>
      <div id="window-header">
        <WindowControls target="txtfile" />
        <h2>{name}</h2>
      </div>

      <div className="text-file-window">
        {previewImage ? (
          <div className="w-full">
            <img src={previewImage} alt={name} className="w-full h-auto rounded"/>
          </div>
        ) : null}

        <div className="text-file-content">
          <h3>{name}</h3>
          {subtitle ? <p className="subtitle">{subtitle}</p> : null}

          <div className="text-file-body">
            {description.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

const TextWindow = WindowWrapper(Text, 'txtfile');

export default TextWindow;