export default function getCurrentController(){
    return getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController();
}