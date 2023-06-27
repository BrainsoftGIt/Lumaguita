import {kconst} from "../index";
import {TriggerEvent, TriggersMethod } from "kconst/src/lib/KConst";


kconst.trigger( TriggersMethod.DECLARE, TriggerEvent.BEFORE, () => {
    //TODO declare body trigger here
});

kconst.trigger( TriggersMethod.DECLARE, TriggerEvent.AFTER, () => {
    //TODO declare body trigger here
});

kconst.trigger( TriggersMethod.PUBLISH, TriggerEvent.BEFORE, () => {
    //TODO declare body trigger here
});

kconst.trigger( TriggersMethod.PUBLISH, TriggerEvent.AFTER, () => {
    //TODO declare body trigger here
});
