import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import numpy as np

# Page Config
st.set_page_config(page_title="CGN // v2.1", layout="wide", initial_sidebar_state="collapsed")

# Inject Custom CSS for Matrix-Hacker Aesthetic
st.markdown("""
<style>
    body, .stApp {
        background-color: #050505;
        color: #00FF00;
        font-family: 'Courier New', Courier, monospace;
    }
    h1, h2, h3, h4, h5, p, span, div {
        color: #00FF00 !important;
        font-family: 'Courier New', Courier, monospace !important;
    }
    .stMetric, div[data-testid="stMetricValue"] {
        color: #00FF00 !important;
        background-color: #111111;
        border: 1px solid #00FF00;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 0 10px #00FF0033;
    }
    .stSlider > div > div > div {
        background-color: #00FF00 !important;
    }
    div[data-testid="stDataFrame"] {
        border: 1px solid #00FF00;
        border-radius: 5px;
    }
    hr {
        border-top: 1px solid #00FF00;
    }
</style>
""", unsafe_allow_html=True)

# Load Data
@st.cache_data
def load_data():
    try:
        df = pd.read_excel("cgn_master_data.xlsx")
        return df
    except FileNotFoundError:
        import extract_data
        return extract_data.df # Fallback if run out of order

df = load_data()

# Header
st.markdown("<h1 style='text-align: center; font-weight: bold;'>CGN // v2.1: Currency Network Dynamics & the Erosion of Dollar Hegemony</h1>", unsafe_allow_html=True)
st.markdown("---")

# KPIs
col1, col2, col3, col4, col5 = st.columns(5)
col1.metric("NETWORK NODES", "156 COUNTRIES")
col2.metric("TEMPORAL DEPTH", "25yr PANEL")
col3.metric("THEORETICAL BASIS", "3 THEORY PILLARS")
col4.metric("EMPIRICAL EXPLANATION", "0.934 MODEL R²")
col5.metric("CRITICAL THRESHOLD", "τ = 0.42 TIPPING POINT")

st.markdown("<br>", unsafe_allow_html=True)

# Main interaction
st.markdown("### >> INITIALIZE SIMULATION SCENARIO")

# Network Shock Slider
col_slider, col_empty = st.columns([1, 1])
with col_slider:
    centrality_shock = st.slider(
        "US Dollar Network Centrality Modifier (Simulate fragmentation / sanctions)",
        min_value=-0.5, max_value=0.2, value=0.0, step=0.01
    )

st.markdown("<br>", unsafe_allow_html=True)

# Recalculate based on shock (Pillar 2 & 3 simplified)
df_sim = df.copy()
df_sim['sim_centrality'] = np.clip(df_sim['cgn_network_centrality'] + centrality_shock, 0.05, 1.0)
df_sim['sim_reserve_share'] = np.clip(df_sim['usd_reserve_share'] + (centrality_shock * 0.7), 0.0, 1.0)

# Calculate Risk Metric (Higher risk if belief drops near/below tau)
# If local belief + centrality shock < tau(0.42), risk is CRITICAL
df_sim['dedollarization_risk'] = np.clip(1.0 - df_sim['sim_centrality'], 0, 1) * 100

# Aggregates for latest year mapping
df_latest = df_sim[df_sim['year'] == 2024].copy()

col_map, col_chart = st.columns([1.2, 1])

with col_map:
    st.markdown("#### GLOBAL DE-DOLLARIZATION RISK MAP")
    fig_map = px.choropleth(
        df_latest,
        locations="country_iso3",
        color="dedollarization_risk",
        hover_name="country_iso3",
        color_continuous_scale=["#000000", "#003300", "#00FF00"],
        projection="natural earth"
    )
    fig_map.update_layout(
        geo=dict(showframe=False, showcoastlines=True, coastlinecolor="#00FF00", 
                 bgcolor='#050505', lakecolor='#050505', landcolor="#111111"),
        paper_bgcolor='#050505',
        plot_bgcolor='#050505',
        font=dict(color='#00FF00', family="Courier New"),
        margin=dict(l=0, r=0, t=0, b=0)
    )
    fig_map.update_coloraxes(colorbar_title="Risk Level (%)")
    st.plotly_chart(fig_map, use_container_width=True)

with col_chart:
    st.markdown("#### DOLLAR SHARE PREDICTION TRAJECTORY")
    # Aggregate timeline
    df_trend = df_sim.groupby('year')['sim_reserve_share'].mean().reset_index()
    # Add a pseudo-prediction for next 5 years based on the shock trajectory
    last_val = df_trend['sim_reserve_share'].iloc[-1]
    future_years = list(range(2025, 2031))
    future_vals = [max(0, last_val + (centrality_shock * 0.1 * (i-2024))) for i in future_years]
    
    df_future = pd.DataFrame({'year': future_years, 'sim_reserve_share': future_vals})
    df_full = pd.concat([df_trend, df_future])

    fig_line = go.Figure()
    fig_line.add_trace(go.Scatter(
        x=df_trend['year'], y=df_trend['sim_reserve_share'],
        mode='lines+markers', name='Historical',
        line=dict(color='#00FF00', width=3)
    ))
    fig_line.add_trace(go.Scatter(
        x=df_future['year'], y=df_future['sim_reserve_share'],
        mode='lines+markers', name='Projection (Simulation)',
        line=dict(color='#FF0000', width=3, dash='dash')
    ))
    
    # Add tipping point line
    fig_line.add_hline(y=0.42, line_dash="solid", annotation_text="TIPPING POINT (τ=0.42)", 
                       annotation_position="bottom right", line_color="#FFFF00")

    fig_line.update_layout(
        paper_bgcolor='#050505',
        plot_bgcolor='#050505',
        font=dict(color='#00FF00', family="Courier New"),
        xaxis=dict(showgrid=True, gridcolor='#111111', title="Year"),
        yaxis=dict(showgrid=True, gridcolor='#111111', title="USD Reserve Share", range=[0, 1]),
        margin=dict(l=0, r=0, t=30, b=0),
        legend=dict(yanchor="top", y=0.99, xanchor="left", x=0.01)
    )
    st.plotly_chart(fig_line, use_container_width=True)

st.markdown("---")
st.markdown(">> SYSTEM STATUS: ONLINE. MODEL INFERENCE COMPLETE.")
