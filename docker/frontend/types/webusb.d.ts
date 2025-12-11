interface USBDevice {
    usbVersionMajor: number;
    usbVersionMinor: number;
    usbVersionSubminor: number;
    deviceClass: number;
    deviceSubclass: number;
    deviceProtocol: number;
    vendorId: number;
    productId: number;
    deviceVersionMajor: number;
    deviceVersionMinor: number;
    deviceVersionSubminor: number;
    manufacturerName?: string;
    productName?: string;
    serialNumber?: string;
    configuration?: any;
    configurations: any[];
    opened: boolean;
    open(): Promise<void>;
    close(): Promise<void>;
    selectConfiguration(configurationValue: number): Promise<void>;
    claimInterface(interfaceNumber: number): Promise<void>;
    releaseInterface(interfaceNumber: number): Promise<void>;
    selectAlternateInterface(interfaceNumber: number, alternateSetting: number): Promise<void>;
    controlTransferIn(setup: any, length: number): Promise<any>;
    controlTransferOut(setup: any, data?: any): Promise<any>;
    transferIn(endpointNumber: number, length: number): Promise<any>;
    transferOut(endpointNumber: number, data: any): Promise<any>;
    reset(): Promise<void>;
}

interface USB {
    onconnect: ((event: any) => void) | null;
    ondisconnect: ((event: any) => void) | null;
    getDevices(): Promise<USBDevice[]>;
    requestDevice(options: { filters: any[] }): Promise<USBDevice>;
}

interface Navigator {
    usb: USB;
}
