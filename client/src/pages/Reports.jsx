import React, { useState } from 'react';
import { FileText, Download, Printer, Shield, ArrowUpRight, CheckCircle2, FileSpreadsheet, FileCode } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import { formatDate } from '../utils/formatters';

export default function Reports() {
  const [reportData, setReportData] = useState(null);
  const [loadingType, setLoadingType] = useState(null);
  const toast = useToast();

  const reportTemplates = [
    {
      id: 'Transaction Analysis Report',
      title: 'Transaction Analysis Report',
      description: 'Full historical ledger breakdown, input/output structures, fee distribution, and anomaly triggers.',
      lastGenerated: 'Today, 09:30 AM',
      icon: FileText
    },
    {
      id: 'Wallet Analysis Report',
      title: 'Wallet Intelligence & Behavioral Report',
      description: 'Comprehensive profiling of active wallets, counterparty degree, velocity trends, and risk scores.',
      lastGenerated: 'Yesterday',
      icon: Shield
    },
    {
      id: 'Risk Analysis Report',
      title: 'AI Anomaly & Risk Analysis Report',
      description: 'Statistical summary of IsolationForest ML scoring, outlier triggers, and risk level classifications.',
      lastGenerated: '3 days ago',
      icon: FileText
    },
    {
      id: 'Network Analysis Report',
      title: 'Network Topology & Graph Report',
      description: 'Graph centrality metrics, cluster flows, high-frequency node hubs, and counterparty relationships.',
      lastGenerated: '1 week ago',
      icon: FileText
    },
    {
      id: 'Daily Monitoring Report',
      title: 'Daily Compliance Monitoring Summary',
      description: '24-hour summary of total transaction volume, high-risk flags, active alerts, and system health.',
      lastGenerated: 'Today, 07:00 AM',
      icon: FileText
    }
  ];

  const handleGenerateReport = async (templateId) => {
    setLoadingType(templateId);
    try {
      const res = await API.post('/reports/generate', {
        report_type: templateId,
        date_range: 'Last 7 Days',
        risk_level: ''
      });

      if (res.success) {
        setReportData(res.report);
        toast.success(`Generated ${templateId}`);
      }
    } catch (err) {
      console.error('Error generating report:', err);
      toast.error('Failed to generate report');
    } finally {
      setLoadingType(null);
    }
  };

  const handleExportJSON = () => {
    if (!reportData) return;
    const jsonStr = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportData.id}_report.json`;
    a.click();
    toast.success('Downloaded JSON report');
  };

  const handleExportCSV = () => {
    if (!reportData || !reportData.records) return;
    const keys = Object.keys(reportData.records[0] || {});
    const csvRows = [
      keys.join(','),
      ...reportData.records.map((r) => keys.map((k) => JSON.stringify(r[k] || '')).join(','))
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportData.id}_report.csv`;
    a.click();
    toast.success('Downloaded CSV report');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto print:p-0 print:bg-white print:text-black">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gray-100 dark:bg-[#202428] text-[#F7931A]">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Compliance & Forensic Reports</h1>
          </div>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Generate, preview, and export formal compliance and audit documentation in PDF, CSV, or JSON formats.
          </p>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:hidden">
        {reportTemplates.map((tpl) => {
          const Icon = tpl.icon;
          const isGenerating = loadingType === tpl.id;
          return (
            <div key={tpl.id} className="saas-card p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-gray-100 dark:bg-[#202428] text-gray-700 dark:text-gray-300">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">Last: {tpl.lastGenerated}</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{tpl.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{tpl.description}</p>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-[#2D3135] flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-mono">PDF • CSV • JSON</span>
                <button
                  onClick={() => handleGenerateReport(tpl.id)}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  <span>{isGenerating ? 'Compiling...' : 'Generate Report'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Generated Report Preview Modal / Display */}
      {reportData && (
        <div className="saas-card p-6 md:p-8 space-y-6">
          {/* Action Bar (Print / PDF / CSV / JSON) */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-[#2D3135] pb-4 print:hidden">
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Report Ref ID: </span>
              <span className="text-xs font-mono font-bold text-[#F7931A]">{reportData.id}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-[#202428] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-[#2D3135] rounded-xl hover:bg-gray-200 dark:hover:bg-[#262A2E]"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-[#202428] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-[#2D3135] rounded-xl hover:bg-gray-200 dark:hover:bg-[#262A2E]"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handleExportJSON}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-[#202428] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-[#2D3135] rounded-xl hover:bg-gray-200 dark:hover:bg-[#262A2E]"
              >
                <FileCode className="w-3.5 h-3.5 text-blue-500" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* Official Document Header */}
          <div className="border-b-2 border-[#F7931A] pb-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">{reportData.title}</h2>
                <p className="text-xs text-[#F7931A] font-semibold uppercase tracking-wider mt-0.5">Bitcoin Traffic Intelligence • Official Audit Document</p>
              </div>
              <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                <div>Date: {formatDate(reportData.generated_at)}</div>
                <div>Analyst: {reportData.generated_by}</div>
              </div>
            </div>
          </div>

          {/* Document Summary Stats */}
          <div className="saas-card-secondary p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-gray-500 dark:text-gray-400 block">Report ID</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">{reportData.id}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400 block">Total Records</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{reportData.total_records} entries</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400 block">Time Horizon</span>
              <span className="font-medium text-gray-900 dark:text-white">{reportData.filter_criteria?.date_range || 'Last 7 Days'}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400 block">Risk Filter</span>
              <span className="font-semibold text-[#F7931A]">{reportData.filter_criteria?.risk_level || 'All Risk Levels'}</span>
            </div>
          </div>

          {/* Table Preview */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-gray-100 dark:bg-[#202428] text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-[#2D3135]">
                <tr>
                  <th className="p-2.5">Record ID / Hash</th>
                  <th className="p-2.5">Timestamp</th>
                  <th className="p-2.5">Risk Score</th>
                  <th className="p-2.5">Severity</th>
                  <th className="p-2.5">Summary / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#26292D]">
                {(reportData.records || []).slice(0, 10).map((rec, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-[#202428]/50">
                    <td className="p-2.5 font-semibold text-[#F7931A]">{rec.tx_hash ? rec.tx_hash.substring(0, 16) + '...' : `Record #${rec.id}`}</td>
                    <td className="p-2.5 text-gray-500 dark:text-gray-400">{formatDate(rec.timestamp || rec.created_at)}</td>
                    <td className="p-2.5 font-bold text-gray-900 dark:text-white">{rec.risk_score || 75} / 100</td>
                    <td className="p-2.5 font-bold uppercase text-rose-600 dark:text-rose-400">{rec.risk_level || rec.severity || 'HIGH'}</td>
                    <td className="p-2.5 text-gray-600 dark:text-gray-300 max-w-xs truncate">{rec.status || rec.description || 'Verified anomaly record'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Signoff */}
          <div className="pt-4 border-t border-gray-100 dark:border-[#2D3135] text-[11px] text-gray-400 flex justify-between items-center">
            <span>CONFIDENTIAL • FOR AUTHORIZED ANALYST USE ONLY</span>
            <span>Generated by Bitcoin Traffic Intelligence AI</span>
          </div>
        </div>
      )}
    </div>
  );
}
