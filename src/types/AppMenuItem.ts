export interface AppMenuItem {
  emits?: string;
  id?: string;
  type?: string;
  label?: string;
  sublabel?: string;
  visible?: boolean;
  enabled?: boolean;
  checked?: boolean;
  accelerator?: string;
  submenu?: AppMenuItem[];
  value?: any;
}
