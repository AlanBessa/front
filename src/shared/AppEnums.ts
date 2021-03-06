﻿import {
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
    WorbbyOfferDtoWorbbyOfferStatus,
    WorbbyTaskDtoTime,
    SaleInputSaleStatus,
    BalanceTransferDtoBalanceTransferStatus
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

export class PaymentPeriodType {
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
    Post = Number(WorbbyTaskDtoStatus._1), //Tarefa Postada
    Hired = Number(WorbbyTaskDtoStatus._2), //Tarefa Contratada
    Start = Number(WorbbyTaskDtoStatus._3), //Tarefa Iniciada
    Delivered = Number(WorbbyTaskDtoStatus._4), //Tarefa Entregue
    Canceled = Number(WorbbyTaskDtoStatus._5), // Tarefa Cancelada
    Paid = Number(WorbbyTaskDtoStatus._6), // Tarefa Paga
    OfferAcceptedByWorbbient = Number(WorbbyTaskDtoStatus._7), // * Oferta aceita pelo worbbient
    OfferCanceledByWorbbient = Number(WorbbyTaskDtoStatus._8), // * Oferta regeitada pelo worbbient
    OfferCanceledByWorbbior = Number(WorbbyTaskDtoStatus._9), // Oferta cancelada pelo Worbbior
    OfferConfirmedByWorbbior = Number(WorbbyTaskDtoStatus._10), // Oferta de tarefa confirmada pelo Worbbior
    WorbbyTaskProposalAcceptedByWorbbior = Number(WorbbyTaskDtoStatus._11), //* Tarefa proposta  aceita pelo Worbbior
    WorbbyTaskProposalRefusedByWorbbior = Number(WorbbyTaskDtoStatus._12) //* Tarefa proposta recusada pelo Worbbior
}

export enum SaleStatus {
    NotFinished = Number(SaleInputSaleStatus._0), //Falha ao processar o pagamento
    Authorized = Number(SaleInputSaleStatus._1), //Meio de pagamento apto a ser capturado ou pago(Boleto)
    PaymentConfirmed = Number(SaleInputSaleStatus._2),  //Pagamento confirmado e finalizado
    Denied = Number(SaleInputSaleStatus._3), //Negado
    Voided = Number(SaleInputSaleStatus._10), //Pagamento cancelado
    Refunded = Number(SaleInputSaleStatus._11), //Pagamento Cancelado/Estornado
    Pending = Number(SaleInputSaleStatus._12), //Esperando retorno da instituição financeira
    Aborted = Number(SaleInputSaleStatus._13), //Pagamento cancelado por falha no processamento
    Scheduled = Number(SaleInputSaleStatus._20), //Recorrência agendada
}

export enum WorbbyTaskMessageReadState {
    Unread = Number(WorbbyTaskMessageDtoReadState._1),
    Read = Number(WorbbyTaskMessageDtoReadState._2),
}

export enum WorbbyTaskMessageSide {
    Sender = Number(WorbbyTaskMessageDtoSide._1),
    Receiver = Number(WorbbyTaskMessageDtoSide._2),
}

export enum WorbbyOfferStatus {
    Post = Number(WorbbyOfferDtoWorbbyOfferStatus._1), //Oferta postada
    Accepted = Number(WorbbyOfferDtoWorbbyOfferStatus._2), //Oferta postada
    Canceled = Number(WorbbyOfferDtoWorbbyOfferStatus._3), //Oferta cancelada
}

export enum TimeEnum {
    AnyTime = Number(WorbbyTaskDtoTime._1), //Qualquer horário, contar como 0h
    Morning = Number(WorbbyTaskDtoTime._2), //entre 8 e 12 contar como 8h
    Afternoon = Number(WorbbyTaskDtoTime._3), //entre 12 e 18 contar como 12h
    Night = Number(WorbbyTaskDtoTime._4), //após 18h contar como 18h
    AllDay = Number(WorbbyTaskDtoTime._5) // Dia todo contar como 0h
}

export enum BalanceTransferStatus {
    Requested = Number(BalanceTransferDtoBalanceTransferStatus._1),
    Credited = Number(BalanceTransferDtoBalanceTransferStatus._2),
    Canceled = Number(BalanceTransferDtoBalanceTransferStatus._3)
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

export class SaleTypes {
    items: KeyValueItem[];

    constructor() {
        this.items = [];
        this.items.push(new KeyValueItem("", "Todos"));
        this.items.push(new KeyValueItem("CreditCard", "Cartão de crédito"));
        this.items.push(new KeyValueItem("CreditWorbby", "Crédito Worbby"));
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
    public start: moment.Moment;
    public end: moment.Moment;

    constructor(pStart: moment.Moment, pEnd: moment.Moment) {
        this.start = pStart;
        this.end = pEnd;
    }
}