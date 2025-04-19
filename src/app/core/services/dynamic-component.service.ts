import {
    Injectable,
    ComponentFactoryResolver,
    ApplicationRef,
    Injector,
    EmbeddedViewRef,
} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DynamicComponentService {
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector,
    ) {}

    create(component: any, data?: any): any {
        // 1. Create component reference
        const componentRef = this.componentFactoryResolver
            .resolveComponentFactory(component)
            .create(this.injector);

        // 2. Pass data if provided
        if (data) {
            Object.assign(componentRef.instance, data);
        }

        // 3. Attach to view
        this.appRef.attachView(componentRef.hostView);

        // 4. Get DOM element
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        // 5. Add to body
        document.body.appendChild(domElem);

        return {
            componentRef,
            destroy: () => {
                this.appRef.detachView(componentRef.hostView);
                componentRef.destroy();
            },
        };
    }
}
