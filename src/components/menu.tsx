import { Component } from "solid-js";
import { createSignal } from "solid-js";
import dragElement from "../lib/createDraggable";
import makeResizableDiv from "../lib/createResizable";
import { onMount } from "solid-js";
import { FiChevronDown, FiChevronUp, FiMoreHorizontal, FiArrowDownRight } from "solid-icons/fi";
import "../index.css"
export const Menu : Component = (props : any) => {
    const [open, setOpen] = createSignal(false)

    let ref2!: any
    let resizerright!: any
    let dragheader!: any

    let [heightbefore, setHeightBefore] = createSignal("fit-content")

    function checkOpen() {
        if (!open()) {
          setHeightBefore(ref2.offsetHeight)
        }
        setOpen(!open())
        moveUp()
      }

      function moveUp() {
        if (!open()) {
          if (ref2.offsetTop + parseInt(heightbefore()) >= window.innerHeight) {
            let addto = ref2.offsetTop
            ref2.style.top = addto - (ref2.offsetTop + Number.parseInt(heightbefore()) - window.innerHeight) + "px"
            if (ref2.offsetTop < 0) {
              ref2.style.top = 0 + "px"
            } else {
    
            }
          }
          ref2.style.height = heightbefore() + "px"
        }
        else {
          ref2.style.height = "fit-content"
        }
      }
      onMount(() => {
        makeResizableDiv(ref2, resizerright,props.minwidth, props.minheight)
        dragElement(ref2, dragheader);
      });

    return(
        <div ref={ref2}  id={props.itemid} class="z-50 w-3/12 flex flex-col absolute" >
        <div class="flex items-center justify-between box-border border-2 bg-slate-800 "><div class="flex flex-row justify-around items-center w-2/3" ref={dragheader} id="dragdivheader"><FiMoreHorizontal color="white" /><h1 class="select-none">{props.title}</h1></div>{open() ? <FiChevronDown onClick={checkOpen} color="white" class="custom-icon z-60 w-1/3" title="a11y" /> : <FiChevronUp onClick={checkOpen} color="white" class="custom-icon z-60 w-1/3" title="a11y" />}</div>
        <div style={open() && { display: "none", visibility: "hidden" }} class="text-white flex flex-col h-full items-center justify-between bg-slate-800 ">
            {(props.children) && props.children}
          <FiArrowDownRight ref={resizerright} class="self-end resizer z-40"></FiArrowDownRight>
        </div>
      </div>
    )
    
    }