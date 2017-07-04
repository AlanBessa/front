import {
    ChatMessageDtoReadState,
    ChatMessageDtoSide,
    FriendDtoState,
    DefaultTimezoneScope,
    UserNotificationState,
    IsTenantAvailableOutputState,
    IncomeStatisticsDateInterval,
    RegisterTenantInputSubscriptionStartType,
    CreatePaymentDtoEditionPaymentType,
    CreatePaymentDtoPaymentPeriodType,
    CreatePaymentDtoSubscriptionPaymentGatewayType,
    SalesSummaryDatePeriod,
    WorbbyTaskMessageDtoSide, 
    WorbbyTaskMessageDtoReadState, 
    WorbbyTaskDtoStatus, 
    WorbbyTaskDtoScheduleDateType, 
    WorbbiorDtoWorbbiorState, 
    EndorsementDtoEndorsementState, 
    UserActivityInputActivityState, 
    UserActivityInputUnitMeasure, 
    AvailabilityDtoDayOfWeek, 
    UserActivityInputCancellationPolicy, 
} from '@shared/service-proxies/service-proxies';
import * as moment from "moment";

export class AppChatMessageReadState {
    static Unread: number = ChatMessageDtoReadState._1;
    static Read: number = ChatMessageDtoReadState._2;
}

export class AppChatSide {
    static Sender: number = ChatMessageDtoSide._1;
    static Receiver: number = ChatMessageDtoSide._2;
}

export class AppFriendshipState {
    static Accepted: number = FriendDtoState._1;
    static Blocked: number = FriendDtoState._2;
}


export class AppTimezoneScope {
    static Application: number = DefaultTimezoneScope._1;
    static Tenant: number = DefaultTimezoneScope._2;
    static User: number = DefaultTimezoneScope._4;
}

export class AppUserNotificationState {
    static Unread: number = UserNotificationState._0;
    static Read: number = UserNotificationState._1;
}

export class AppTenantAvailabilityState {
    static Available: number = IsTenantAvailableOutputState._1;
    static InActive: number = IsTenantAvailableOutputState._2;
    static NotFound: number = IsTenantAvailableOutputState._3;
}

export class AppIncomeStatisticsDateInterval {
    static Daily: number = IncomeStatisticsDateInterval._1;
    static Weekly: number = IncomeStatisticsDateInterval._2;
    static Monthly: number = IncomeStatisticsDateInterval._3;
}

export class SubscriptionStartType {

    static Free: number = RegisterTenantInputSubscriptionStartType._1;
    static Trial: number = RegisterTenantInputSubscriptionStartType._2;
    static Paid: number = RegisterTenantInputSubscriptionStartType._3;
}

export class EditionPaymentType {
    static NewRegistration: number = CreatePaymentDtoEditionPaymentType._0;
    static BuyNow: number = CreatePaymentDtoEditionPaymentType._1;
    static Upgrade: number = CreatePaymentDtoEditionPaymentType._2;
    static Extend: number = CreatePaymentDtoEditionPaymentType._3;
}

export class AppEditionExpireAction {
    static DeactiveTenant: string = "DeactiveTenant";
    static AssignToAnotherEdition: string = "AssignToAnotherEdition";
}

export class PaymentPeriodType  {
    static Monthly: number = CreatePaymentDtoPaymentPeriodType._30;
    static Annual: number = CreatePaymentDtoPaymentPeriodType._365;
}

export class SubscriptionPaymentGatewayType {
    static Paypal: number = CreatePaymentDtoSubscriptionPaymentGatewayType._1;
}

export class AppSalesSummaryDatePeriod {
    static Daily: number = SalesSummaryDatePeriod._1;
    static Weekly: number = SalesSummaryDatePeriod._2;
    static Monthly: number = SalesSummaryDatePeriod._3;
}

// Classes para enuns do Worbby

export enum ActivityState {
    Inactive = Number(UserActivityInputActivityState._0),
    Active = Number(UserActivityInputActivityState._1),
    InactiveByWorbbior = Number(UserActivityInputActivityState._2),
}

export enum EndorsementState {
    Awaiting = Number(EndorsementDtoEndorsementState._0),
    Endorsed = Number(EndorsementDtoEndorsementState._1),
    Refused = Number(EndorsementDtoEndorsementState._2),
}

export enum UnitMeasure {
    Hour = Number(UserActivityInputUnitMeasure._1),
    Unit = Number(UserActivityInputUnitMeasure._2),
}

export enum WorbbiorState {
    PreRegistration = Number(WorbbiorDtoWorbbiorState._0),
    Active = Number(WorbbiorDtoWorbbiorState._1),
    WaitingActivation = Number(WorbbiorDtoWorbbiorState._2),
    Inactive = Number(WorbbiorDtoWorbbiorState._3),
    WaitingEdit = Number(WorbbiorDtoWorbbiorState._4),
    WaitingActivEdit = Number(WorbbiorDtoWorbbiorState._5),
}

export enum CancellationPolicy {
    SuperFlex = Number(UserActivityInputCancellationPolicy._1),
    Flex = Number(UserActivityInputCancellationPolicy._2),
    Moderate = Number(UserActivityInputCancellationPolicy._3),
    Strict = Number(UserActivityInputCancellationPolicy._4),
}

export enum DayOfWeek {
    Sunday = Number(AvailabilityDtoDayOfWeek._0),
    Monday = Number(AvailabilityDtoDayOfWeek._1),
    Tuesday = Number(AvailabilityDtoDayOfWeek._2),
    Wednesday = Number(AvailabilityDtoDayOfWeek._3),
    Thursday = Number(AvailabilityDtoDayOfWeek._4),
    Friday = Number(AvailabilityDtoDayOfWeek._5),
    Saturday = Number(AvailabilityDtoDayOfWeek._6),
}

export enum ScheduleDateType {
    WhenPossible = Number(WorbbyTaskDtoScheduleDateType._1),
    Fixed = Number(WorbbyTaskDtoScheduleDateType._2),
}

export enum WorbbyTaskStatus {
    Post = Number(WorbbyTaskDtoStatus._1),
    Hired = Number(WorbbyTaskDtoStatus._2),
    Start = Number(WorbbyTaskDtoStatus._3),
    Delivered = Number(WorbbyTaskDtoStatus._4),
    Canceled = Number(WorbbyTaskDtoStatus._5),
    Paid = Number(WorbbyTaskDtoStatus._6)
}

export enum WorbbyTaskMessageReadState{
    Unread = Number(WorbbyTaskMessageDtoReadState._1),
    Read = Number(WorbbyTaskMessageDtoReadState._2),
}

export enum WorbbyTaskMessageSide{
    Sender = Number(WorbbyTaskMessageDtoSide._1),
    Receiver = Number(WorbbyTaskMessageDtoSide._2),
}

export class AdministrativeAreas {
    items: KeyValueAddress[];

    constructor() {
        this.items = [];
        this.items.push(new KeyValueAddress("AC", "Acre"));
        this.items.push(new KeyValueAddress("AL", "Alagoas"));
        this.items.push(new KeyValueAddress("AP", "Amapá"));
        this.items.push(new KeyValueAddress("AM", "Amazonas"));
        this.items.push(new KeyValueAddress("BA", "Bahia"));
        this.items.push(new KeyValueAddress("CE", "Ceará"));
        this.items.push(new KeyValueAddress("DF", "Distrito Federal"));
        this.items.push(new KeyValueAddress("ES", "Espírito Santo"));
        this.items.push(new KeyValueAddress("GO", "Goiás"));
        this.items.push(new KeyValueAddress("MA", "Maranhão"));
        this.items.push(new KeyValueAddress("MT", "Mato Grosso"));
        this.items.push(new KeyValueAddress("MS", "Mato Grosso do Sul"));
        this.items.push(new KeyValueAddress("MG", "Minas Gerais"));
        this.items.push(new KeyValueAddress("PA", "Pará"));
        this.items.push(new KeyValueAddress("PB", "Paraíba"));
        this.items.push(new KeyValueAddress("PR", "Paraná"));
        this.items.push(new KeyValueAddress("PE", "Pernambuco"));
        this.items.push(new KeyValueAddress("PI", "Piauí"));
        this.items.push(new KeyValueAddress("RJ", "Rio de Janeiro"));
        this.items.push(new KeyValueAddress("RN", "Rio Grande do Norte"));
        this.items.push(new KeyValueAddress("RS", "Rio Grande do Sul"));
        this.items.push(new KeyValueAddress("RO", "Rondônia"));
        this.items.push(new KeyValueAddress("RR", "Roraima"));
        this.items.push(new KeyValueAddress("SC", "Santa Catarina"));
        this.items.push(new KeyValueAddress("SP", "São Paulo"));
        this.items.push(new KeyValueAddress("SE", "Sergipe"));
        this.items.push(new KeyValueAddress("TO", "Tocantins"));
    }
}

export class Countries {
    items: KeyValueItem[];

    constructor() {
        this.items = [];
        this.items.push(new KeyValueItem("BR", "Brasil"));
    }
}

export class ContactSubjects {
    items: KeyValueItem[];

    constructor() {
        this.items = [];
        this.items.push(new KeyValueItem("Doubts", "Dúvida"));
        this.items.push(new KeyValueItem("Praise", "Elogio"));
        this.items.push(new KeyValueItem("Payment", "Pagamento"));
        this.items.push(new KeyValueItem("Complaint", "Reclamação"));
        this.items.push(new KeyValueItem("Report", "Reportar"));
        this.items.push(new KeyValueItem("Others", "Outros"));
    }
}

export class KeyValueItem {
    key: string = '';
    value: string = '';

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }
}

export class KeyValueAddress {
    id: string = '';
    text: string = '';

    constructor(key: string, value: string) {
        this.id = key;
        this.text = value;
    }
}

export class DateFilter {
    public de: moment.Moment;
    public ate: moment.Moment;

    constructor(pDe: moment.Moment, pAte: moment.Moment) {
        this.de = pDe;
        this.ate = pAte;
    }
}