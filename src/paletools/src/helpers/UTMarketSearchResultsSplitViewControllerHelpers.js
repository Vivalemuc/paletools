const UTMarketSearchResultsSplitViewControllerHelpers = {
    selectListItemByIndex: (index) => {
        const controller = getCurrentController();
        if(!controller instanceof UTMarketSearchResultsSplitViewController) return;

        const searchResultsController = controller._leftController;
        const list = searchResultsController.getView()._list;
        const itemDetailsController = controller._rightController._currentController;
        list.selectRow(list.listRows[index].id);
        itemDetailsController._viewmodel.setIndex(index);
        itemDetailsController._renderView();
        list.listRows[index].getRootElement().scrollIntoView();
    }
};

export default UTMarketSearchResultsSplitViewControllerHelpers;