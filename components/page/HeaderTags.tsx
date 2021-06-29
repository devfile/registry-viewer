import {
Label,
Popover
  } from '@patternfly/react-core'

interface Props {
    tags:string[]|null
}

const HeaderTags =  ({tags}:Props)=>{
    const numOfVisibleTags = 8
    if(!tags)
        return null
        
    return (
    <div>
        {tags.map((tag, index)=> (index<numOfVisibleTags)&&
            <Label color="blue" className="m-0.5" key={tag}>{tag}</Label>)
        }

        {(tags.length>numOfVisibleTags)&& 
        <Popover
            aria-label="extra tags popover"
            position="bottom"
            bodyContent={<div>{tags.map((tag, index)=> (index>=numOfVisibleTags)&&
                <Label color="blue" className="m-0.5" key={tag}>{tag}</Label>)
            }</div>}
            >
        <Label>{tags.length -  numOfVisibleTags} more</Label>
        </Popover>}
    </div>)

}
export default HeaderTags