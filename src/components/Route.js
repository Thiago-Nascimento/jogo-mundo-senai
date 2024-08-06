export const Route = ({path, children}) => {
    if(path === window.location.pathname){
        return children
    }
}

export default Route;